import re
from typing import List, Optional, Dict, Any
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.models import Document, DocumentChunk

class SearchEngine:
    def __init__(self):
        self.es_client = None
        if settings.ELASTICSEARCH_ENABLED and settings.ELASTICSEARCH_URL:
            try:
                from elasticsearch import Elasticsearch
                self.es_client = Elasticsearch([settings.ELASTICSEARCH_URL])
                if not self.es_client.ping():
                    self.es_client = None
            except Exception as e:
                print(f"[SearchEngine] Elasticsearch connection failed, using fallback engine: {e}")
                self.es_client = None

    def search_documents(
        self,
        query: str,
        state: Optional[str] = None,
        district: Optional[str] = None,
        topic: Optional[str] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        document_type: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        # If ES client is available, run Elasticsearch DSL query
        if self.es_client:
            try:
                return self._search_elasticsearch(query, state, district, topic, year_from, year_to, document_type, limit)
            except Exception as e:
                print(f"[SearchEngine] ES search error: {e}, falling back to database search")

        # Fallback search engine: token matching + weighted scoring + metadata filtering
        return self._search_fallback(query, state, district, topic, year_from, year_to, document_type, limit)

    def _search_elasticsearch(
        self, query: str, state: Optional[str], district: Optional[str],
        topic: Optional[str], year_from: Optional[int], year_to: Optional[int],
        document_type: Optional[str], limit: int
    ) -> List[Dict[str, Any]]:
        must_clauses = [
            {"multi_match": {"query": query, "fields": ["title^3", "tags^2", "content_text", "methodology"]}}
        ]
        filters = []
        if state and state != "All":
            filters.append({"term": {"state.keyword": state}})
        if district and district != "All":
            filters.append({"term": {"district.keyword": district}})
        if topic and topic != "All":
            filters.append({"term": {"topic.keyword": topic}})
        if document_type and document_type != "All":
            filters.append({"term": {"document_type.keyword": document_type}})
        if year_from or year_to:
            range_clause = {}
            if year_from:
                range_clause["gte"] = year_from
            if year_to:
                range_clause["lte"] = year_to
            filters.append({"range": {"year": range_clause}})

        body = {
            "query": {
                "bool": {
                    "must": must_clauses,
                    "filter": filters
                }
            },
            "size": limit
        }
        res = self.es_client.search(index="bhumi_documents", body=body)
        hits = res.get("hits", {}).get("hits", [])
        results = []
        for h in hits:
            source = h.get("_source", {})
            results.append({
                "id": source.get("id"),
                "title": source.get("title"),
                "source": source.get("source"),
                "publisher": source.get("publisher"),
                "document_type": source.get("document_type"),
                "topic": source.get("topic"),
                "state": source.get("state"),
                "district": source.get("district"),
                "year": source.get("year"),
                "tags": source.get("tags"),
                "snippet": source.get("content_text", "")[:320] + "...",
                "relevance_score": float(h.get("_score", 1.0)),
                "geographic_coverage": source.get("geographic_coverage"),
                "data_status": source.get("data_status"),
                "source_url": source.get("source_url")
            })
        return results

    def _search_fallback(
        self, query: str, state: Optional[str], district: Optional[str],
        topic: Optional[str], year_from: Optional[int], year_to: Optional[int],
        document_type: Optional[str], limit: int
    ) -> List[Dict[str, Any]]:
        db = SessionLocal()
        try:
            docs_query = db.query(Document)
            if state and state != "All":
                docs_query = docs_query.filter(Document.state == state)
            if district and district != "All":
                docs_query = docs_query.filter(Document.district == district)
            if topic and topic != "All":
                docs_query = docs_query.filter(Document.topic == topic)
            if document_type and document_type != "All":
                docs_query = docs_query.filter(Document.document_type == document_type)
            if year_from:
                docs_query = docs_query.filter(Document.year >= year_from)
            if year_to:
                docs_query = docs_query.filter(Document.year <= year_to)

            all_docs = docs_query.all()
            scored_results = []
            q_tokens = set(re.findall(r"\w+", query.lower()))

            for doc in all_docs:
                title_tokens = set(re.findall(r"\w+", doc.title.lower()))
                tag_tokens = set(re.findall(r"\w+", (doc.tags or "").lower()))
                content_tokens = set(re.findall(r"\w+", doc.content_text.lower()))

                # Compute weighted score
                title_match = len(q_tokens.intersection(title_tokens)) * 4.0
                tag_match = len(q_tokens.intersection(tag_tokens)) * 3.0
                content_match = len(q_tokens.intersection(content_tokens)) * 1.0
                base_score = 1.0 + title_match + tag_match + content_match

                # Create relevant snippet
                snippet = doc.content_text[:320] + "..."
                scored_results.append({
                    "id": doc.id,
                    "title": doc.title,
                    "source": doc.source,
                    "publisher": doc.publisher,
                    "document_type": doc.document_type,
                    "topic": doc.topic,
                    "state": doc.state,
                    "district": doc.district,
                    "year": doc.year,
                    "tags": doc.tags,
                    "snippet": snippet,
                    "relevance_score": round(base_score, 2),
                    "geographic_coverage": doc.geographic_coverage,
                    "data_status": doc.data_status,
                    "source_url": doc.source_url
                })

            scored_results.sort(key=lambda x: x["relevance_score"], reverse=True)
            return scored_results[:limit]
        finally:
            db.close()

search_engine = SearchEngine()
