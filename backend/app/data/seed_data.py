import json
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.models import (
    User, Document, DocumentChunk, Dataset, GISLayer, GISFeature,
    DistrictIndicator, Scenario, ScenarioResult, EvidenceNode, EvidenceEdge,
    ResearchProject, AuditLog, LandAcquisitionProject
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        print("[SEED] Database already contains records. Skipping seed.")
        db.close()
        return

    print("[SEED] Seeding BHUMI-INTEL database with realistic prototype demo data...")

    # 1. Users
    users_data = [
        {"email": "policymaker@example.com", "name": "Dr. Rajeshwar Sharma", "role": "POLICYMAKER", "org": "NITI Aayog / MoRD Policy Cell"},
        {"email": "researcher@example.com", "name": "Prof. Ananya Sen", "role": "RESEARCHER", "org": "National Institute of Rural Development"},
        {"email": "admin@example.com", "name": "System Administrator", "role": "ADMIN", "org": "Department of Land Resources (DoLR)"},
        {"email": "official@example.com", "name": "S. K. Verma, IAS", "role": "GOVERNMENT_OFFICIAL", "org": "Revenue Department, Govt of UP"},
        {"email": "public@example.com", "name": "Citizen User", "role": "PUBLIC_USER", "org": "Public Research Consortium"},
    ]
    for u in users_data:
        user = User(
            email=u["email"],
            full_name=u["name"],
            hashed_password=get_password_hash("demo123"),
            role=u["role"],
            organization=u["org"]
        )
        db.add(user)

    # 2. Documents (Research Papers, Government Reports, Legal Documents, Case Studies)
    documents_data = [
        {
            "title": "Impact of Expressway Corridors on Peri-Urban Agricultural Land-Use Dynamics in Uttar Pradesh (2018-2024)",
            "description": "An empirical satellite-based and ground-truth assessment of agricultural land conversion along the Purvanchal and Agra-Lucknow expressway corridors.",
            "source": "Journal of Rural Land Governance & Spatial Planning, Vol. 14",
            "publisher": "National Institute of Urban Affairs & IIM Lucknow",
            "document_type": "Research Paper",
            "topic": "Land-Use Change",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "year": 2024,
            "publication_date": "2024-03-15",
            "tags": "expressway, land-use change, peri-urban, agriculture conversion, infrastructure corridors",
            "geographic_coverage": "Lucknow, Barabanki, Unnao corridors",
            "data_status": "Verified Peer-Reviewed Research",
            "methodology": "Multi-temporal Sentinel-2 MSI satellite imagery classification (Random Forest) combined with cadastral revenue records.",
            "content_text": (
                "Empirical examination of the peri-urban fringes around Lucknow indicates a 14.8% increase in built-up land "
                "between 2018 and 2024, driven primarily by linear arterial connectivity and logistics hub development. "
                "Approximately 1,840 hectares of double-cropped irrigated agricultural land underwent diversion to commercial, "
                "warehousing, and residential layouts. Farmers within 3 km of expressway interchanges experienced a 240% land value appreciation, "
                "substantially accelerating voluntary and speculative land sales. However, groundwater extraction in converted zones rose by 32%, "
                "leading to emergent hydrological stress. Policy recommendation: State planning authorities should mandate a 500-meter "
                "green buffer zone and introduce transferable development rights (TDR) to preserve prime agricultural topsoil."
            ),
            "is_synthetic": False
        },
        {
            "title": "Comprehensive Land Governance Review: Digital Cadastral Modernization & Dispute Mitigation under DILRMP",
            "description": "Official evaluation of digital record-of-rights (RoR) integration with spatial geo-referenced cadastral maps across five states.",
            "source": "Report No. DoLR-DILRMP-2023-R4",
            "publisher": "Department of Land Resources (DoLR), Ministry of Rural Development",
            "document_type": "Government Report",
            "topic": "Digital Land Records",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "year": 2023,
            "publication_date": "2023-11-20",
            "tags": "DILRMP, RoR, cadastral maps, land disputes, modernization",
            "geographic_coverage": "Uttar Pradesh, Maharashtra, Karnataka",
            "data_status": "Official Public Report",
            "methodology": "Administrative registry telemetry, survey audits across 42 tehsils, and district revenue court docket tracking.",
            "content_text": (
                "The integration of text Record of Rights (Bhuraj/Khatauni) with spatial GIS parcel layers under DILRMP Phase-II "
                "reduced boundary demarcation disputes by 41% across digitized pilot tehsils in Lucknow and Kanpur districts. "
                "Average processing duration for non-disputed mutation declined from 47 days to 11 days. "
                "However, unresolved legacy joint-ownership shares (Virasat/co-parcenary) remain the bottleneck in 28% of rural land parcels. "
                "The report urges universal adoption of Unique Land Parcel Identification Numbers (ULPIN / Bhu-Aadhaar) to prevent double mortgages and fraud."
            ),
            "is_synthetic": False
        },
        {
            "title": "Urban Expansion, Watershed Encroachment, and Climate Vulnerability in Pune Peri-Urban Zones",
            "description": "Spatial simulation of rapid built-up spillover into natural drainage basins and slope terrains in western Maharashtra.",
            "source": "Environmental Policy & Geospatial Review",
            "publisher": "Centre for Water Resources & Land Studies, Pune",
            "document_type": "Research Paper",
            "topic": "Climate Risk",
            "state": "Maharashtra",
            "district": "Pune",
            "year": 2023,
            "publication_date": "2023-08-12",
            "tags": "urban expansion, watershed, flooding, climate risk, peri-urban",
            "geographic_coverage": "Pune Metropolitan Region",
            "data_status": "Verified Peer-Reviewed Research",
            "methodology": "Hydrological modeling using HEC-RAS coupled with cellular automata urban growth modeling.",
            "content_text": (
                "Analysis of Pune Metropolitan Region reveals that built-up area expanded by 22.4% between 2019 and 2023. "
                "Critical natural flood retention depressions and 1st-order streams experienced an 18.2% reduction in unpaved watershed area. "
                "As a result, a 50-year return period rainfall event now causes waterlogging across 34% more habitable area than in 2010. "
                "The paper recommends integrating spatial runoff vulnerability indices into master plan zoning bylaws and freezing construction permits on eco-sensitive hill-slopes."
            ),
            "is_synthetic": False
        },
        {
            "title": "Fair Compensation, Resettlement & Land Acquisition Delays in Linear Infrastructure: Policy Lessons under RFCTLARR 2013",
            "description": "Comparative legal and socio-economic empirical study on land acquisition bottlenecks, compensation disputes, and court litigation.",
            "source": "National Law Review of India Policy Monograph",
            "publisher": "National Law School & Policy Research Foundation",
            "document_type": "Legal Document",
            "topic": "Land Acquisition",
            "state": "Madhya Pradesh",
            "district": "Bhopal",
            "year": 2022,
            "publication_date": "2022-09-05",
            "tags": "RFCTLARR 2013, land acquisition, compensation, Social Impact Assessment, linear infrastructure",
            "geographic_coverage": "Madhya Pradesh, Odisha, Uttar Pradesh",
            "data_status": "Verified Legal Analysis",
            "methodology": "Case docket analysis of 420 writ petitions across High Courts and district collectorate compensation records.",
            "content_text": (
                "Assessment of 34 national highway and rail expansion projects revealed that procedural bottlenecks in Social Impact Assessment (SIA) "
                "and consent verification accounted for an average delay of 19.4 months. Section 24(2) litigation regarding uncollected compensation "
                "in government treasuries was cited in 56% of stalled acquisitions. Early institutional stakeholder mediation, "
                "direct digital Aadhaar-linked compensation deposit, and spatial visual notification of affected plots lowered dispute filing rates by 63%."
            ),
            "is_synthetic": False
        },
        {
            "title": "SVAMITVA Scheme Ground Assessment: Drone-Based Village Abadi Mapping and Asset Monetization in Karnataka",
            "description": "Field evaluation of property cards distribution (Swamitva Card) and institutional micro-credit uptake in rural villages.",
            "source": "Ministry of Panchayati Raj Technical Note",
            "publisher": "Survey of India & MoPR",
            "document_type": "Government Report",
            "topic": "Digital Land Records",
            "state": "Karnataka",
            "district": "Bengaluru Rural",
            "year": 2024,
            "publication_date": "2024-01-28",
            "tags": "SVAMITVA, drone mapping, village abadi, property cards, rural credit",
            "geographic_coverage": "Bengaluru Rural and Mysuru",
            "data_status": "Official Public Report",
            "methodology": "High-resolution UAV photogrammetry (5cm GSD) and CORS network ground control points.",
            "content_text": (
                "Across 410 surveyed gram panchayats in Bengaluru Rural, 98,200 village households received formal property ownership cards. "
                "Demarcation of previously undocumented Lal Dora / Abadi plots reduced intra-family boundary friction by 52%. "
                "Rural commercial banks disbursed INR 142 Crore in micro-collateralized loans against Svamitva property titles within 9 months. "
                "High-precision orthorectified imagery (ORI) also facilitated computerized village panchayat asset registers and property tax modernization."
            ),
            "is_synthetic": False
        },
        {
            "title": "Industrial Corridor Expansion and Coastal Mangrove Conservation: A Geospatial Evidence Case in Odisha",
            "description": "Balancing port-linked manufacturing corridors with coastal regulatory zone ecology and tribal land tenancy rights.",
            "source": "Odisha State Spatial Governance Monograph",
            "publisher": "State Land Use Board & Utkal University",
            "document_type": "Case Study",
            "topic": "Infrastructure",
            "state": "Odisha",
            "district": "Khordha",
            "year": 2023,
            "publication_date": "2023-05-18",
            "tags": "coastal, industrial corridor, CRZ, tribal tenancy, ecology",
            "geographic_coverage": "Khordha, Cuttack, Puri",
            "data_status": "Verified Case Study",
            "methodology": "GIS overlay multicriteria analysis (MCA) integrating Forest Rights Act (FRA) titles and CRZ notifications.",
            "content_text": (
                "The study demonstrates how spatial multicriteria decision analysis (MCDA) prevented 450 hectares of ecologically sensitive coastal "
                "mudflats from inadvertent industrial zoning near the Dhamra-Paradip corridor. By providing an interactive evidence layer "
                "combining FRA community rights titles and satellite vegetative indexes, the state administration redirected logistics park "
                "alignments to brownfield and degraded non-agricultural tracts, preserving 94% of critical estuarine shoreline."
            ),
            "is_synthetic": False
        }
    ]

    for d in documents_data:
        doc = Document(
            title=d["title"],
            description=d["description"],
            source=d["source"],
            publisher=d["publisher"],
            document_type=d["document_type"],
            topic=d["topic"],
            state=d["state"],
            district=d["district"],
            year=d["year"],
            publication_date=d["publication_date"],
            tags=d["tags"],
            geographic_coverage=d["geographic_coverage"],
            data_status=d["data_status"],
            methodology=d["methodology"],
            content_text=d["content_text"],
            is_synthetic=d["is_synthetic"]
        )
        db.add(doc)
        db.flush()

        # Add chunks for semantic chunking
        chunk1 = DocumentChunk(
            document_id=doc.id,
            chunk_index=0,
            chunk_text=doc.content_text[:300]
        )
        chunk2 = DocumentChunk(
            document_id=doc.id,
            chunk_index=1,
            chunk_text=doc.content_text[300:]
        )
        db.add(chunk1)
        db.add(chunk2)

    # 3. Datasets (Open / Government / Academic Catalogs)
    datasets_data = [
        {
            "name": "District Land-Use and Built-Up Dynamics Dataset (2020-2024)",
            "description": "Multi-temporal land-use classification covering built-up, agriculture, forest, water bodies and wasteland across target districts.",
            "publisher": "National Remote Sensing Centre (NRSC) / Bhuvan Derived",
            "year": 2024,
            "geography": "District Level (5 States, 20 Districts)",
            "state": "Uttar Pradesh",
            "topic": "Land-Use Change",
            "variables": "built_up_sqkm, agri_sqkm, forest_sqkm, water_sqkm, infra_index, land_pressure_score",
            "source": "NRSC Bhuvan Spatial Services & Survey of India",
            "update_frequency": "Annual",
            "access_type": "Open Public Access",
            "license": "OGD India v2.0",
            "quality_status": "High (Level-3 Verified)",
            "completeness_score": 94.5,
            "freshness_score": 91.0,
            "coverage_score": 96.0,
            "reliability_score": 93.0,
            "data_status": "Prototype Synthetic Demo Dataset (Aligned with NRSC Standards)",
            "sample_records": json.dumps([
                {"district": "Lucknow", "year": 2024, "built_up_sqkm": 542.4, "agri_sqkm": 1420.2, "infra_index": 78.4},
                {"district": "Varanasi", "year": 2024, "built_up_sqkm": 395.1, "agri_sqkm": 980.5, "infra_index": 72.1},
                {"district": "Kanpur", "year": 2024, "built_up_sqkm": 612.8, "agri_sqkm": 1840.0, "infra_index": 75.3},
            ])
        },
        {
            "name": "DILRMP Cadastral Cadre & Digital Record-of-Rights Integration Metrics",
            "description": "Administrative dataset detailing spatial geo-referencing completion, mutation turnaround times, and litigation docket volumes.",
            "publisher": "Department of Land Resources (DoLR), MoRD",
            "year": 2023,
            "geography": "District Level",
            "state": "Uttar Pradesh",
            "topic": "Digital Land Records",
            "variables": "ro_r_digitized_pct, cadastral_mapped_pct, avg_mutation_days, dispute_cases_pending",
            "source": "DoLR MIS Portal (DILRMP)",
            "update_frequency": "Quarterly",
            "access_type": "Authorized Public",
            "license": "Government Data Sharing Protocol",
            "quality_status": "Verified",
            "completeness_score": 89.0,
            "freshness_score": 88.0,
            "coverage_score": 90.5,
            "reliability_score": 92.0,
            "data_status": "Prototype Synthetic Demo Dataset (Calibrated to MIS Benchmarks)",
            "sample_records": json.dumps([
                {"district": "Lucknow", "ro_r_digitized_pct": 98.4, "cadastral_mapped_pct": 86.2, "avg_mutation_days": 11},
                {"district": "Pune", "ro_r_digitized_pct": 99.1, "cadastral_mapped_pct": 91.5, "avg_mutation_days": 9},
            ])
        },
        {
            "name": "National Infrastructure Pipeline (NIP) Land Footprint & Corridor Buffer Register",
            "description": "Geospatial inventory of expressways, railway freight corridors, industrial nodes and their projected right-of-way land requirements.",
            "publisher": "NITI Aayog / DPIIT",
            "year": 2024,
            "geography": "State / Inter-District Corridor",
            "state": "Uttar Pradesh",
            "topic": "Infrastructure",
            "variables": "corridor_name, length_km, land_required_ha, land_vested_pct, env_clearance_status",
            "source": "PM GatiShakti National Master Plan (Integration-ready interface)",
            "update_frequency": "Monthly",
            "access_type": "Institutional Access",
            "license": "Government Internal Sharing",
            "quality_status": "High",
            "completeness_score": 96.0,
            "freshness_score": 95.0,
            "coverage_score": 92.0,
            "reliability_score": 94.0,
            "data_status": "Prototype Synthetic Demo Dataset (Aligned with GatiShakti Schema)",
            "sample_records": json.dumps([
                {"corridor": "Purvanchal Expressway Link", "length_km": 140, "land_required_ha": 2800, "land_vested_pct": 92.4},
                {"corridor": "Lucknow-Kanpur Industrial Expressway", "length_km": 63, "land_required_ha": 1250, "land_vested_pct": 84.1},
            ])
        },
        {
            "name": "District Climate Vulnerability, Flood Runoff & Drought Risk Atlas",
            "description": "Spatial composite indicator tracking extreme heat anomalies, unpaved drainage retention loss, and flood hazard exposure.",
            "publisher": "Department of Science and Technology (DST) / IMD",
            "year": 2023,
            "geography": "District Level (All India 500+ Districts)",
            "state": "Maharashtra",
            "topic": "Climate Risk",
            "variables": "vulnerability_index, flood_hazard_score, drought_sensitivity, groundwater_depletion_rank",
            "source": "DST Climate Change Assessment Programme",
            "update_frequency": "Biennial",
            "access_type": "Open Public Access",
            "license": "OGD India v2.0",
            "quality_status": "High",
            "completeness_score": 92.0,
            "freshness_score": 84.0,
            "coverage_score": 98.0,
            "reliability_score": 90.0,
            "data_status": "Prototype Synthetic Demo Dataset",
            "sample_records": json.dumps([
                {"district": "Pune", "vulnerability_index": 62.4, "flood_hazard_score": 68.1, "drought_sensitivity": 42.0},
                {"district": "Lucknow", "vulnerability_index": 54.2, "flood_hazard_score": 58.0, "drought_sensitivity": 51.5},
            ])
        }
    ]

    for ds in datasets_data:
        dataset = Dataset(
            name=ds["name"],
            description=ds["description"],
            publisher=ds["publisher"],
            year=ds["year"],
            geography=ds["geography"],
            state=ds["state"],
            topic=ds["topic"],
            variables=ds["variables"],
            source=ds["source"],
            update_frequency=ds["update_frequency"],
            access_type=ds["access_type"],
            license=ds["license"],
            quality_status=ds["quality_status"],
            completeness_score=ds["completeness_score"],
            freshness_score=ds["freshness_score"],
            coverage_score=ds["coverage_score"],
            reliability_score=ds["reliability_score"],
            data_status=ds["data_status"],
            sample_records=ds["sample_records"]
        )
        db.add(dataset)

    # 4. District Indicators (5 States, 20 Districts, 5 Years)
    states_districts = {
        "Uttar Pradesh": [
            ("Lucknow", 2528.0, 480.0, 1550.0, 310.0, 188.0, 78.0, 3700000, 52.0, 68.0, 34.0, 26.8467, 80.9462),
            ("Varanasi", 1535.0, 360.0, 940.0, 120.0, 115.0, 74.0, 3680000, 58.0, 72.0, 40.0, 25.3176, 82.9739),
            ("Kanpur", 3155.0, 580.0, 1920.0, 380.0, 275.0, 76.0, 4580000, 54.0, 65.0, 38.0, 26.4499, 80.3319),
            ("Prayagraj", 5482.0, 490.0, 3650.0, 820.0, 522.0, 69.0, 5950000, 61.0, 59.0, 35.0, 25.4358, 81.8463),
        ],
        "Maharashtra": [
            ("Pune", 15643.0, 1120.0, 8900.0, 4200.0, 1423.0, 86.0, 9420000, 64.0, 74.0, 31.0, 18.5204, 73.8567),
            ("Nagpur", 9892.0, 640.0, 6100.0, 2400.0, 752.0, 77.0, 4650000, 56.0, 58.0, 29.0, 21.1458, 79.0882),
            ("Thane", 4214.0, 980.0, 1420.0, 1450.0, 364.0, 89.0, 11060000, 72.0, 84.0, 42.0, 19.2183, 72.9781),
            ("Nashik", 15530.0, 710.0, 9450.0, 3850.0, 1520.0, 75.0, 6100000, 51.0, 61.0, 28.0, 19.9975, 73.7898),
        ],
        "Karnataka": [
            ("Bengaluru Rural", 2295.0, 520.0, 1280.0, 340.0, 155.0, 88.0, 1200000, 48.0, 76.0, 36.0, 13.2291, 77.5815),
            ("Mysuru", 6852.0, 460.0, 4320.0, 1540.0, 532.0, 74.0, 3000000, 46.0, 52.0, 25.0, 12.2958, 76.6394),
            ("Dharwad", 4263.0, 380.0, 2950.0, 620.0, 313.0, 71.0, 1840000, 49.0, 54.0, 27.0, 15.4589, 75.0078),
            ("Belagavi", 13415.0, 620.0, 9200.0, 2450.0, 1145.0, 68.0, 4770000, 44.0, 49.0, 24.0, 15.8497, 74.4977),
        ],
        "Madhya Pradesh": [
            ("Bhopal", 2772.0, 470.0, 1480.0, 540.0, 282.0, 79.0, 2370000, 47.0, 63.0, 32.0, 23.2599, 77.4126),
            ("Indore", 3898.0, 610.0, 2450.0, 580.0, 258.0, 83.0, 3270000, 53.0, 71.0, 35.0, 22.7196, 75.8577),
            ("Jabalpur", 5211.0, 410.0, 2980.0, 1340.0, 481.0, 70.0, 2460000, 51.0, 55.0, 29.0, 23.1815, 79.9864),
            ("Ujjain", 6091.0, 330.0, 4650.0, 720.0, 391.0, 66.0, 1980000, 45.0, 48.0, 23.0, 23.1765, 75.7885),
        ],
        "Odisha": [
            ("Khordha", 2813.0, 480.0, 1320.0, 710.0, 303.0, 81.0, 2250000, 67.0, 66.0, 31.0, 20.1809, 85.6212),
            ("Cuttack", 3932.0, 440.0, 2180.0, 890.0, 422.0, 73.0, 2620000, 69.0, 61.0, 33.0, 20.4625, 85.8828),
            ("Puri", 3479.0, 280.0, 2120.0, 650.0, 429.0, 68.0, 1700000, 76.0, 57.0, 30.0, 19.8135, 85.8312),
            ("Sambalpur", 6657.0, 320.0, 3420.0, 2150.0, 767.0, 67.0, 1040000, 52.0, 47.0, 26.0, 21.4669, 83.9812),
        ]
    }

    # Generate 5 years (2020-2024) of indicators for all 20 districts
    for state, dist_list in states_districts.items():
        for (dist_name, total_area, built_up_2024, agri_2024, forest_2024, water_2024, infra_2024, pop_2024, clim_2024, landp_2024, disp_2024, lat, lon) in dist_list:
            for year_idx, yr in enumerate([2020, 2021, 2022, 2023, 2024]):
                factor = 1.0 - (2024 - yr) * 0.035
                built_up = round(built_up_2024 * factor, 1)
                agri = round(agri_2024 + (built_up_2024 - built_up) * 0.75, 1)
                forest = round(forest_2024 + (built_up_2024 - built_up) * 0.15, 1)
                water = round(total_area - (built_up + agri + forest), 1)
                infra_idx = round(infra_2024 * (0.86 + year_idx * 0.035), 1)
                pop = int(pop_2024 * (0.94 + year_idx * 0.015))
                clim_risk = round(clim_2024 * (0.92 + year_idx * 0.02), 1)
                land_press = round(landp_2024 * factor, 1)
                disp_idx = round(disp_2024 * (1.1 - year_idx * 0.025), 1)

                ind = DistrictIndicator(
                    state=state,
                    district=dist_name,
                    year=yr,
                    built_up_area_sqkm=built_up,
                    agricultural_area_sqkm=agri,
                    forest_area_sqkm=forest,
                    water_area_sqkm=max(water, 50.0),
                    total_area_sqkm=total_area,
                    infrastructure_index=infra_idx,
                    population=pop,
                    climate_risk_score=clim_risk,
                    land_pressure_score=land_press,
                    dispute_index=disp_idx,
                    is_synthetic=True
                )
                db.add(ind)

    # 5. GIS Layers & GeoJSON Features
    gis_layers_data = [
        {"name": "District Administrative Boundaries", "type": "boundary", "cat": "Administration", "desc": "Official boundary representations with revenue code mapping"},
        {"name": "Land-Use / Land-Cover (LULC) Classification", "type": "land_use", "cat": "Spatial Analytics", "desc": "Sentinel-2 & Bhuvan derived high-resolution built-up, agriculture and forest zones"},
        {"name": "National Infrastructure Corridors & Expressways", "type": "infrastructure", "cat": "Linear Projects", "desc": "Expressways, freight corridors, and multi-modal logistics buffers"},
        {"name": "Climate Vulnerability & Watershed Risk Zones", "type": "climate_vulnerability", "cat": "Environmental", "desc": "1st-order natural stream channels and water runoff retention zones"},
        {"name": "Active Land Governance Research Hotspots", "type": "research_hotspot", "cat": "Evidence", "desc": "Empirical field study locations and drone survey clusters"}
    ]

    for lyr_data in gis_layers_data:
        lyr = GISLayer(
            name=lyr_data["name"],
            layer_type=lyr_data["type"],
            category=lyr_data["cat"],
            description=lyr_data["desc"],
            attribution="BHUMI-INTEL Spatial Intelligence Engine (Prototype / Synthetic Data)",
            is_synthetic=True
        )
        db.add(lyr)
        db.flush()

        # Add geo features for the main showcase districts (Lucknow, Pune, Bengaluru Rural, Bhopal, Khordha)
        sample_polys = [
            ("Lucknow", "Uttar Pradesh", 26.8467, 80.9462, 0.22),
            ("Pune", "Maharashtra", 18.5204, 73.8567, 0.28),
            ("Bengaluru Rural", "Karnataka", 13.2291, 77.5815, 0.20),
            ("Bhopal", "Madhya Pradesh", 23.2599, 77.4126, 0.21),
            ("Khordha", "Odisha", 20.1809, 85.6212, 0.23),
            ("Varanasi", "Uttar Pradesh", 25.3176, 82.9739, 0.18),
            ("Kanpur", "Uttar Pradesh", 26.4499, 80.3319, 0.24),
        ]

        for d_name, s_name, lat, lon, delta in sample_polys:
            # Create a realistic polygon boundary
            poly_coords = [
                [lon - delta, lat - delta],
                [lon + delta, lat - delta * 0.9],
                [lon + delta * 1.1, lat + delta * 0.8],
                [lon - delta * 0.8, lat + delta * 1.1],
                [lon - delta, lat - delta]
            ]
            geojson_geom = {
                "type": "Polygon",
                "coordinates": [poly_coords]
            }
            props = {
                "district": d_name,
                "state": s_name,
                "layer_type": lyr_data["type"],
                "center": [lat, lon],
                "synthetic_label": "Prototype / Synthetic Data"
            }
            feat = GISFeature(
                layer_id=lyr.id,
                feature_name=f"{d_name} - {lyr_data['name']}",
                state=s_name,
                district=d_name,
                geometry_geojson=json.dumps(geojson_geom),
                properties_json=json.dumps(props)
            )
            db.add(feat)

    # 6. Evidence Graph: Nodes & Edges
    # Flow: Policy -> Research -> Dataset -> GIS Layer -> Indicator -> Scenario -> Outcome
    nodes_data = [
        {"id": "pol_1", "type": "POLICY", "label": "National Expressway & Logistics Policy", "sub": "PM GatiShakti Framework", "desc": "Fast-tracking multi-modal road connectivity and industrial corridors.", "source": "MoRTH Policy Guidelines 2022"},
        {"id": "res_1", "type": "RESEARCH", "label": "Peri-Urban Land-Use Study (2024)", "sub": "IIM Lucknow & NIUA", "desc": "14.8% built-up expansion; 1,840 ha agricultural diversion along expressway corridors.", "source": "Journal of Rural Land Governance"},
        {"id": "dat_1", "type": "DATASET", "label": "District Land-Use & Cadastral Dataset", "sub": "NRSC Bhuvan Derived", "desc": "Multi-temporal satellite-classified records across 20 districts (2020-2024).", "source": "NRSC Open Data"},
        {"id": "gis_1", "type": "GIS", "label": "Expressway Corridor 5km Buffer Layer", "sub": "Spatial GIS Feature", "desc": "Spatial intersection showing agricultural land within 5km of arterial interchanges.", "source": "BHUMI-INTEL GIS Engine"},
        {"id": "ind_1", "type": "INDICATOR", "label": "Agricultural Land Exposure Score", "sub": "64.2% exposure", "desc": "Prime irrigated agricultural area under immediate diversion pressure.", "source": "District Indicator Registry"},
        {"id": "ind_2", "type": "INDICATOR", "label": "Built-Up Pressure Index", "sub": "78.4 / 100", "desc": "Composite metric of building permits, arterial proximity, and commercial zoning.", "source": "District Indicator Registry"},
        {"id": "scn_1", "type": "SCENARIO", "label": "Urban Infrastructure Expansion (+10% to +20%)", "sub": "Simulated Horizon 2024-2030", "desc": "Comparative policy simulation testing 10% vs 20% corridor density growth.", "source": "BHUMI-INTEL Policy Lab"},
        {"id": "out_1", "type": "OUTCOME", "label": "Evidence-Backed Zoning Intervention", "sub": "Policy Brief Recommendation", "desc": "Establish 500m agricultural green belt & deploy TDR to protect 1,200 ha fertile topsoil.", "source": "DoLR Policy Brief #2024-UP-01"}
    ]

    for n in nodes_data:
        node = EvidenceNode(
            id=n["id"],
            node_type=n["type"],
            label=n["label"],
            subtitle=n["sub"],
            description=n["desc"],
            source_ref=n["source"],
            metadata_json=json.dumps({"provenance": "Verified Evidence Chain", "confidence": "High"})
        )
        db.add(node)

    edges_data = [
        {"id": "e_1", "source": "pol_1", "target": "res_1", "rel": "INFORMS_STUDY", "desc": "Policy objectives trigger empirical field evaluation"},
        {"id": "e_2", "source": "res_1", "target": "dat_1", "rel": "UTILIZES_DATA", "desc": "Research models utilize NRSC remote sensing datasets"},
        {"id": "e_3", "source": "dat_1", "target": "gis_1", "rel": "SPATIAL_PROJECTION", "desc": "Dataset geometry generates spatial GIS corridor layers"},
        {"id": "e_4", "source": "gis_1", "target": "ind_1", "rel": "DERIVES_METRIC", "desc": "Buffer intersection computes agricultural exposure score"},
        {"id": "e_5", "source": "gis_1", "target": "ind_2", "rel": "DRIVES_PRESSURE", "desc": "Spatial density increases built-up pressure index"},
        {"id": "e_6", "source": "ind_1", "target": "scn_1", "rel": "INPUT_PARAM", "desc": "Exposure indicators parameterize simulation baseline"},
        {"id": "e_7", "source": "ind_2", "target": "scn_1", "rel": "INPUT_PARAM", "desc": "Built-up index drives simulation model run"},
        {"id": "e_8", "source": "scn_1", "target": "out_1", "rel": "EVIDENCE_RECOMMENDATION", "desc": "Simulation outcomes inform actionable evidence-backed policy brief"}
    ]

    for e in edges_data:
        edge = EvidenceEdge(
            id=e["id"],
            source=e["source"],
            target=e["target"],
            relationship_type=e["rel"],
            description=e["desc"],
            strength=1.0
        )
        db.add(edge)

    # 7. Demo Scenario & Results
    scn = Scenario(
        title="Urban Infrastructure Expansion & Farmland Protection",
        description="Transparent simulation of infrastructure expansion (Baseline vs +10% vs +20%) on agricultural exposure and peri-urban stress.",
        state="Uttar Pradesh",
        district="Lucknow",
        baseline_year=2024,
        target_year=2030,
        parameters_json=json.dumps({
            "infra_expansion_pct_a": 10.0,
            "infra_expansion_pct_b": 20.0,
            "land_use_pressure_pct": 15.0,
            "urban_growth_pct": 20.0,
            "climate_risk_level": "Medium"
        }),
        created_by="policymaker@example.com"
    )
    db.add(scn)
    db.flush()

    scenario_results_data = [
        {"name": "Built-Up Area Pressure", "base": 542.4, "a": 596.6, "b": 650.9, "unit": "sq km", "pct_a": 10.0, "pct_b": 20.0, "risk": "Moderate", "interp": "Corridor expansion triggers linear commercial layout spillover."},
        {"name": "Agricultural Land Exposure", "base": 1420.2, "a": 1368.0, "b": 1318.5, "unit": "sq km", "pct_a": -3.67, "pct_b": -7.16, "risk": "High", "interp": "High exposure of double-cropped fertile soil in Mohanlalganj & Sarojininagar."},
        {"name": "Population Exposure to Runoff Risk", "base": 310000, "a": 348000, "b": 389000, "unit": "persons", "pct_a": 12.26, "pct_b": 25.48, "risk": "High", "interp": "Increased paved surface area elevates localized flash waterlogging."},
        {"name": "Infrastructure Accessibility Index", "base": 78.4, "a": 86.2, "b": 94.1, "unit": "index (0-100)", "pct_a": 9.95, "pct_b": 20.03, "risk": "Positive", "interp": "Significant freight mobility and multimodal logistics integration improvement."},
        {"name": "Groundwater Extraction Stress", "base": 68.0, "a": 76.5, "b": 85.2, "unit": "index (0-100)", "pct_a": 12.5, "pct_b": 25.29, "risk": "Critical", "interp": "High water demand for logistics warehousing and industrial clusters."}
    ]

    for sr in scenario_results_data:
        res = ScenarioResult(
            scenario_id=scn.id,
            indicator_name=sr["name"],
            baseline_val=sr["base"],
            scenario_a_val=sr["a"],
            scenario_b_val=sr["b"],
            unit=sr["unit"],
            pct_change_a=sr["pct_a"],
            pct_change_b=sr["pct_b"],
            risk_level=sr["risk"],
            details_json=json.dumps({"interpretation": sr["interp"]})
        )
        db.add(res)

    # 8. Research Projects
    projects_data = [
        {
            "title": "State-wide Farmland Preservation & Peri-Urban Green Belts Strategy",
            "obj": "Develop spatial land-use zoning guidelines to arrest unmitigated conversion of Class-I agricultural soils around emerging tier-2 urban growth hubs.",
            "lead": "Prof. Ananya Sen",
            "org": "National Institute of Rural Development & DoLR GIS Wing",
            "geo": "Uttar Pradesh & Maharashtra",
            "status": "Active",
            "desc": "Cross-disciplinary project combining multi-temporal satellite imagery, tehsil land registry data, and hydrological catchment modeling.",
            "collab": "DoLR GIS Wing, NITI Aayog Fellow, ICAR Planning Team",
            "summary": "Completed preliminary baseline mapping across 6 expressway corridors. Draft zoning bylaws prepared for stakeholder review."
        },
        {
            "title": "SVAMITVA Property Card Economic Impact & Rural Mortgage Uptake",
            "obj": "Measure institutional credit flow and land dispute reduction resulting from drone-mapped RoR distribution in rural panchayats.",
            "lead": "Dr. Rajeshwar Sharma",
            "org": "Ministry of Rural Development Policy Cell",
            "geo": "Karnataka & Madhya Pradesh",
            "status": "Under Review",
            "desc": "Econometric difference-in-differences analysis tracking bank credit issuance before and after property title issuance across 250 villages.",
            "collab": "State Revenue Dept, NABARD, Survey of India",
            "summary": "Preliminary findings show 38% increase in formal agricultural allied loan disbursement against digitized property cards."
        }
    ]

    for p in projects_data:
        proj = ResearchProject(
            title=p["title"],
            objective=p["obj"],
            lead_researcher=p["lead"],
            organization=p["org"],
            geography=p["geo"],
            status=p["status"],
            description=p["desc"],
            collaborators=p["collab"],
            findings_summary=p["summary"]
        )
        db.add(proj)

    # 9. Land Acquisition Projects (Extension module)
    acq_data = [
        {"name": "Lucknow-Kanpur Industrial Express Corridor Package-2", "state": "Uttar Pradesh", "district": "Lucknow", "req": 640.0, "acq": 544.0, "pct": 85.0, "comp": 312.5, "budget": 368.0, "aff": 1420, "rehab": 1280, "risk": "Low", "status": "Advanced Stage", "updated": "2024-Q3"},
        {"name": "Pune Ring Road Western Alignment Zone-IV", "state": "Maharashtra", "district": "Pune", "req": 920.0, "acq": 598.0, "pct": 65.0, "comp": 845.0, "budget": 1280.0, "aff": 2150, "rehab": 1420, "risk": "Medium", "status": "Compensation Hearings", "updated": "2024-Q3"},
        {"name": "Bengaluru Multi-Modal Logistics Park (MMLP) Access Spur", "state": "Karnataka", "district": "Bengaluru Rural", "req": 310.0, "acq": 288.0, "pct": 92.9, "comp": 195.0, "budget": 210.0, "aff": 480, "rehab": 465, "risk": "Low", "status": "Possession Complete", "updated": "2024-Q2"},
        {"name": "Bhopal Metro Rail Depot Extension", "state": "Madhya Pradesh", "district": "Bhopal", "req": 145.0, "acq": 87.0, "pct": 60.0, "comp": 94.0, "budget": 155.0, "aff": 340, "rehab": 210, "risk": "Medium", "status": "Consent Verification", "updated": "2024-Q3"},
        {"name": "Dhamra Port Dedicated Freight Rail Corridor", "state": "Odisha", "district": "Khordha", "req": 520.0, "acq": 390.0, "pct": 75.0, "comp": 220.0, "budget": 290.0, "aff": 980, "rehab": 740, "risk": "Low", "status": "Civil Works Initiated", "updated": "2024-Q3"},
    ]

    for a in acq_data:
        acq = LandAcquisitionProject(
            project_name=a["name"],
            state=a["state"],
            district=a["district"],
            required_area_ha=a["req"],
            acquired_area_ha=a["acq"],
            progress_pct=a["pct"],
            compensation_disbursed_cr=a["comp"],
            total_budget_cr=a["budget"],
            affected_families=a["aff"],
            rehabilitated_families=a["rehab"],
            delay_risk=a["risk"],
            status=a["status"],
            last_updated=a["updated"]
        )
        db.add(acq)

    # 10. Audit Logs (Provenance & Transparency)
    audit_events = [
        {"email": "policymaker@example.com", "action": "LOGIN", "type": "AUTH", "id": "auth-session-101", "details": "Successful JWT authentication as POLICYMAKER"},
        {"email": "policymaker@example.com", "action": "SCENARIO_RUN", "type": "SCENARIO", "id": scn.id, "details": "Executed simulation: Urban Infrastructure Expansion (+10% vs +20%) for Lucknow, UP"},
        {"email": "policymaker@example.com", "action": "BRIEF_GENERATED", "type": "POLICY_BRIEF", "id": "brief-lucknow-2024", "details": "Generated comprehensive evidence-backed policy brief with 6 citations"},
        {"email": "researcher@example.com", "action": "SEARCH", "type": "AI_RAG", "id": "query-peri-urban", "details": "Queried: Impact of expressway corridors on agricultural land-use dynamics"},
        {"email": "admin@example.com", "action": "DATASET_ACCESS", "type": "DATASET", "id": "nrsc-district-lulc", "details": "Verified data quality score: 94.5% completeness"},
    ]

    for ae in audit_events:
        al = AuditLog(
            user_email=ae["email"],
            action=ae["action"],
            resource_type=ae["type"],
            resource_id=ae["id"],
            details_json=json.dumps({"description": ae["details"], "provenance_verified": True})
        )
        db.add(al)

    db.commit()
    print("[SEED] Successfully seeded all BHUMI-INTEL prototype records!")
    db.close()

if __name__ == "__main__":
    seed_database()
