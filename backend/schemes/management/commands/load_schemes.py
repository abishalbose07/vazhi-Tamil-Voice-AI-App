"""
Vazhi — Seed real government schemes into the database.

USAGE:
    Place this file at: Vazhi/backend/schemes/management/commands/load_schemes.py
    (create the folders if they don't exist)

    Then run:
        python manage.py load_schemes
"""

from django.core.management.base import BaseCommand
from schemes.models import Scheme


SCHEMES_DATA = [
    {
        "name": "PM Vishwakarma Scheme",
        "benefit": "Collateral-free loans up to ₹1 lakh in the first tranche and ₹2 lakh in the second tranche at concessional 5% interest rate. Also includes a ₹15,000 toolkit incentive, skill training with ₹500/day stipend, and marketing support.",
        "eligibility": "Traditional artisans and craftspeople engaged in 18 specified trades (including pottery, weaving, woodwork, goldsmithing, blacksmithing) working with their hands and basic tools.",
        "how_to_apply": "Apply online at pmvishwakarma.gov.in or through nearest Common Service Centre (CSC). Registration is done via biometric authentication.",
        "documents_required": "Aadhaar card, ration card, bank account details, mobile number, proof of traditional trade/craft.",
        "applicable_crafts": "Pottery, Weaving, Carpentry, Goldsmithing, Blacksmithing, Tailoring, Stone Carving, Tanjore Art, Handicrafts",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "benefit": "Collateral-free loans up to ₹10 lakh for micro-enterprises, divided into Shishu (up to ₹50,000), Kishore (₹50,001–₹5 lakh), and Tarun (₹5 lakh–₹10 lakh) categories.",
        "eligibility": "Any individual running or starting a non-farm income-generating micro/small enterprise, including artisans and craftspeople.",
        "how_to_apply": "Apply at any nearby bank branch (public, private, RRB, cooperative) or NBFC/MFI with a simple business plan.",
        "documents_required": "Aadhaar card, PAN card, business proof/plan, bank account, passport-size photo.",
        "applicable_crafts": "All crafts and trades",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "One District One Product (ODOP) — Thanjavur",
        "benefit": "Funding, branding, and marketing support for district-specific signature products (e.g. Tanjore Plates and Paintings for Thanjavur). Includes export promotion and exhibition participation.",
        "eligibility": "Artisans and producers making the officially designated product of their district.",
        "how_to_apply": "Contact District Industries Centre (DIC) Thanjavur or apply through the ODOP portal under the Ministry of Commerce.",
        "documents_required": "Aadhaar card, proof of craft/business, bank account details.",
        "applicable_crafts": "Tanjore Plates, Tanjore Paintings (district-specific elsewhere)",
        "applicable_districts": "Thanjavur",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "benefit": "Subsidized loan to set up new micro-enterprises. SC/ST/OBC/women get higher subsidy (25-35%) than general category (15-25%). Max project cost ₹50 lakh for manufacturing, ₹20 lakh for services.",
        "eligibility": "Individuals above 18 years setting up a new micro-enterprise; minimum 8th-grade education for projects above ₹10 lakh.",
        "how_to_apply": "Apply online at kviconline.gov.in or through KVIC, State KVIB, or District Industries Centre.",
        "documents_required": "Aadhaar card, educational certificate, project report, bank account, caste certificate (if applicable).",
        "applicable_crafts": "All manufacturing and service-based crafts",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "TAHDCO Economic Development Schemes",
        "benefit": "Capital subsidy and concessional loans for self-employment, skill development, and business expansion specifically for Scheduled Caste artisans and entrepreneurs.",
        "eligibility": "Scheduled Caste individuals residing in Tamil Nadu seeking self-employment or business support.",
        "how_to_apply": "Contact TAHDCO district office or visit tahdco.tn.gov.in for scheme details and application.",
        "documents_required": "Community certificate, Aadhaar card, income certificate, bank account details.",
        "applicable_crafts": "All crafts and small businesses",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "SC",
        "min_income": None,
        "max_income": 100000,
    },
    {
        "name": "Tamil Nadu Adi Dravidar Welfare — ST schemes (ADW/TAHDCO equivalent)",
        "benefit": "Capital assistance, training, and concessional loans for Scheduled Tribe artisans and small business owners.",
        "eligibility": "Scheduled Tribe individuals residing in Tamil Nadu.",
        "how_to_apply": "Contact the Adi Dravidar and Tribal Welfare Department district office.",
        "documents_required": "Tribal/community certificate, Aadhaar card, income proof.",
        "applicable_crafts": "All crafts and small businesses",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "ST",
        "min_income": None,
        "max_income": 100000,
    },
    {
        "name": "Artisan Identity Card (Pehchan Card) — Ministry of Textiles",
        "benefit": "Official artisan recognition enabling participation in national/international exhibitions, design workshops, marketing support, and access to social security schemes.",
        "eligibility": "Practicing handicraft artisans across India.",
        "how_to_apply": "Apply online via handicrafts.nic.in/data/artisanlogin or at regional handicrafts offices.",
        "documents_required": "Aadhaar card, photograph, proof of craft practice.",
        "applicable_crafts": "All handicrafts including Tanjore Art, weaving, pottery, woodwork",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        "benefit": "Life insurance cover of ₹2 lakh for an annual premium of ₹436, auto-debited from a linked savings account.",
        "eligibility": "Individuals aged 18-50 with a savings bank account.",
        "how_to_apply": "Enroll through the bank where the savings account is held.",
        "documents_required": "Aadhaar card, bank account, nominee details.",
        "applicable_crafts": "Not craft-specific — general social security",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        "benefit": "Accidental death and disability insurance cover of ₹2 lakh for an annual premium of just ₹20.",
        "eligibility": "Individuals aged 18-70 with a savings bank account.",
        "how_to_apply": "Enroll through the bank where the savings account is held.",
        "documents_required": "Aadhaar card, bank account, nominee details.",
        "applicable_crafts": "Not craft-specific — general social security",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
    {
        "name": "Tamil Nadu Handicrafts Development Corporation (Poompuhar) Support",
        "benefit": "Direct procurement of handicraft products at fair prices, retail outlet display (Poompuhar showrooms), and design/training support for artisans.",
        "eligibility": "Registered handicraft artisans in Tamil Nadu.",
        "how_to_apply": "Contact the nearest Poompuhar showroom or Tamil Nadu Handicrafts Development Corporation office.",
        "documents_required": "Aadhaar card, proof of craft, sample products for evaluation.",
        "applicable_crafts": "Tanjore Art, Bronze work, Wood carving, Handloom, Pottery",
        "applicable_districts": "All Tamil Nadu districts",
        "caste_eligibility": "all",
        "min_income": None,
        "max_income": None,
    },
]


class Command(BaseCommand):
    help = "Load real government schemes data into the Scheme table"

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for data in SCHEMES_DATA:
            obj, created = Scheme.objects.update_or_create(
                name=data["name"],
                defaults={
                    "benefit": data["benefit"],
                    "eligibility": data["eligibility"],
                    "how_to_apply": data["how_to_apply"],
                    "documents_required": data["documents_required"],
                    "applicable_crafts": data["applicable_crafts"],
                    "applicable_districts": data["applicable_districts"],
                    "caste_eligibility": data["caste_eligibility"],
                    "min_income": data["min_income"],
                    "max_income": data["max_income"],
                    "is_active": True,
                },
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done! Created {created_count} new schemes, updated {updated_count} existing schemes. "
                f"Total schemes in database: {Scheme.objects.count()}"
            )
        )