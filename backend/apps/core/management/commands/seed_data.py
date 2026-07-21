from datetime import date

from django.core.management.base import BaseCommand
from django.db.models.signals import post_delete, post_save
from django.utils import timezone

from apps.core.models import Article, Certification, Education, Experience, Profile, Project, Skill
from apps.core.signals import (
    article_deleted,
    article_saved,
    certification_deleted,
    certification_saved,
    education_deleted,
    education_saved,
    experience_deleted,
    experience_saved,
    profile_saved,
    project_deleted,
    project_saved,
    skill_deleted,
    skill_saved,
)

SIGNAL_HANDLERS = (
    (post_save, profile_saved, Profile),
    (post_save, skill_saved, Skill),
    (post_delete, skill_deleted, Skill),
    (post_save, experience_saved, Experience),
    (post_delete, experience_deleted, Experience),
    (post_save, education_saved, Education),
    (post_delete, education_deleted, Education),
    (post_save, certification_saved, Certification),
    (post_delete, certification_deleted, Certification),
    (post_save, project_saved, Project),
    (post_delete, project_deleted, Project),
    (post_save, article_saved, Article),
    (post_delete, article_deleted, Article),
)

PROJECT_GROUP_ID = "b2c3d4e5-f6a7-8901-bcde-f23456789012"
LEVELHAFT_GROUP_ID = "c3d4e5f6-a7b8-9012-cdef-345678901234"
ARTICLE_GROUP_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

PROJECT_DESCRIPTION_EN = (
    "<p>A production-ready portfolio stack with bilingual routing, API-driven content, "
    "and containerized deployment.</p>"
    "<h3>Highlights</h3>"
    "<ul>"
    "<li>Django REST Framework API with Redis caching</li>"
    "<li>Next.js App Router frontend with ISR and on-demand revalidation</li>"
    "<li>PostgreSQL, Docker Compose, and Nginx-ready architecture</li>"
    "</ul>"
)

PROJECT_DESCRIPTION_FA = (
    "<p>استک production-ready برای پورتفولیو با مسیریابی دوزبانه، محتوای API-driven "
    "و deploy با Docker.</p>"
    "<h3>ویژگی‌ها</h3>"
    "<ul>"
    "<li>API با Django REST Framework و کش Redis</li>"
    "<li>فرانت‌اند Next.js با ISR و revalidation درخواستی</li>"
    "<li>PostgreSQL، Docker Compose و معماری آماده Nginx</li>"
    "</ul>"
)

LEVELHAFT_DESCRIPTION_EN = (
    "<p>Production Persian skincare e-commerce platform for the Iranian market — "
    "catalog, checkout, payments, and admin workflows on levelhaft.com.</p>"
    "<h3>Highlights</h3>"
    "<ul>"
    "<li>Phone OTP authentication (Kavenegar) with beautician tier pricing</li>"
    "<li>Session cart, order lifecycle, Pasargad gateway, and wallet split payments</li>"
    "<li>Business discount codes with admin analytics and Excel export</li>"
    "<li>Workshop registration, blog CMS, Jalali calendar, and SEO sitemap</li>"
    "<li>Deployed on Liara with PostgreSQL, WhiteNoise, and Gunicorn</li>"
    "</ul>"
)

LEVELHAFT_DESCRIPTION_FA = (
    "<p>پلتفرم production فروش آنلاین محصولات مراقبت پوست برای بازار ایران — "
    "کاتالوگ، پرداخت، و جریان‌های مدیریتی روی levelhaft.com.</p>"
    "<h3>ویژگی‌ها</h3>"
    "<ul>"
    "<li>ورود با OTP موبایل (کاوه‌نگار) و قیمت‌گذاری دو سطحی برای بیوتیشن‌ها</li>"
    "<li>سبد خرید session-based، مدیریت سفارش، درگاه پاسارگاد و پرداخت ترکیبی کیف پول</li>"
    "<li>کدهای تخفیف بیزنس با گزارش‌گیری ادمین و خروجی Excel</li>"
    "<li>ثبت‌نام کارگاه، بلاگ، تقویم جلالی و sitemap برای SEO</li>"
    "<li>استقرار روی لیارا با PostgreSQL، WhiteNoise و Gunicorn</li>"
    "</ul>"
)

ARTICLE_CONTENT_EN = (
    "<p>This portfolio is built as a headless content platform.</p>"
    "<p>The backend exposes versioned REST APIs for profile, projects, skills, and blog articles. "
    "Each content type supports English and Persian with separate slugs and translation groups.</p>"
    "<h2>Frontend</h2>"
    "<p>The frontend uses Next.js App Router with next-intl for locale routing, ISR-friendly API fetching, "
    "and per-page SEO metadata including JSON-LD for articles.</p>"
    "<h2>Deployment</h2>"
    "<p>Docker Compose ties PostgreSQL, Redis, Django, and Next.js together for local development "
    "and production parity.</p>"
)

ARTICLE_CONTENT_FA = (
    "<p>این پورتفولیو به‌صورت یک پلتفرم محتوای headless طراحی شده است.</p>"
    "<p>بک‌اند APIهای REST نسخه‌دار برای پروفایل، پروژه‌ها، مهارت‌ها و مقالات بلاگ ارائه می‌دهد. "
    "هر نوع محتوا از انگلیسی و فارسی با slug جداگانه و گروه ترجمه پشتیبانی می‌کند.</p>"
    "<h2>فرانت‌اند</h2>"
    "<p>فرانت‌اند از Next.js App Router با next-intl برای مسیریابی locale، "
    "واکشی API با ISR و متادیتای SEO در سطح هر صفحه از جمله JSON-LD برای مقالات استفاده می‌کند.</p>"
    "<h2>استقرار</h2>"
    "<p>Docker Compose پایگاه PostgreSQL، Redis، Django و Next.js را برای توسعه محلی "
    "و هم‌راستایی production به هم وصل می‌کند.</p>"
)


class Command(BaseCommand):
    help = "Seed bilingual profile, skills, career data, projects, and articles"

    def handle(self, *args, **options):
        for signal, handler, sender in SIGNAL_HANDLERS:
            signal.disconnect(handler, sender=sender)

        try:
            self._seed()
        finally:
            for signal, handler, sender in SIGNAL_HANDLERS:
                signal.connect(handler, sender=sender)

    def _seed(self):
        profiles = [
            {
                "language": "en",
                "full_name": "Morteza Kamalian",
                "title": "Backend-Focused Full-Stack Developer",
                "tagline": "Web Developer | Python | Django | DRF | SQL | Next.js",
                "bio": (
                    "I am a backend-focused full-stack developer with 11+ years of professional experience "
                    "across software engineering, project management, and product delivery.\n\n"
                    "Today I work as a Senior Software Developer (freelance), building scalable APIs and "
                    "modern web products with Python, Django, DRF, PostgreSQL, and Next.js. My background "
                    "in project management and marketing helps me bridge business goals with clean technical execution.\n\n"
                    "I care about reliable architecture, measurable performance, and polished user experiences — "
                    "from database design to deployment with Docker."
                ),
                "email": "hello@kamalian.dev",
                "location": "Tehran, Iran",
                "timezone": "Asia/Tehran",
                "availability_status": "Open to remote opportunities",
                "hero_primary_cta": "View Projects",
                "hero_secondary_cta": "Get in Touch",
                "activity_summary_title": "Summary of My Work",
                "activity_summary_text": (
                    "I design and build production-grade products with a backend-first mindset. "
                    "My work spans architecture design, API development, optimization, and polished frontend delivery."
                ),
                "about_highlights": [
                    {
                        "title": "Backend Systems",
                        "description": "Django, DRF, PostgreSQL, Redis — APIs built for scale, clarity, and long-term maintainability.",
                    },
                    {
                        "title": "Full-Stack Delivery",
                        "description": "Next.js and React frontends paired with robust APIs and admin-driven content workflows.",
                    },
                    {
                        "title": "SEO & Digital Growth",
                        "description": "Google-certified in digital marketing with hands-on experience in technical SEO and content strategy.",
                    },
                ],
                "github_url": "https://github.com/kakashi708",
                "linkedin_url": "https://www.linkedin.com/in/morteza-kamalian-ab5a7b55",
            },
            {
                "language": "fa",
                "full_name": "مرتضی کمالیان",
                "title": "توسعه‌دهنده فول‌استک با تمرکز بر بک‌اند",
                "tagline": "توسعه‌دهنده وب | Python | Django | DRF | SQL | Next.js",
                "bio": (
                    "من یک توسعه‌دهنده فول‌استک با تمرکز بر بک‌اند هستم و بیش از ۱۱ سال تجربه حرفه‌ای در "
                    "مهندسی نرم‌افزار، مدیریت پروژه و تحویل محصول دارم.\n\n"
                    "در حال حاضر به‌صورت فریلنس به‌عنوان توسعه‌دهنده ارشد نرم‌افزار فعالیت می‌کنم و روی "
                    "APIهای مقیاس‌پذیر و محصولات وب مدرن با Python، Django، DRF، PostgreSQL و Next.js کار می‌کنم. "
                    "پیشینه مدیریت پروژه و بازاریابی به من کمک می‌کند اهداف کسب‌وکار را با اجرای فنی دقیق ترکیب کنم.\n\n"
                    "برای من معماری پایدار، عملکرد قابل اندازه‌گیری و تجربه کاربری حرفه‌ای — از طراحی دیتابیس تا "
                    "استقرار با Docker — اهمیت بالایی دارد."
                ),
                "email": "hello@kamalian.dev",
                "location": "تهران، ایران",
                "timezone": "Asia/Tehran",
                "availability_status": "آماده فرصت‌های ریموت",
                "hero_primary_cta": "مشاهده پروژه‌ها",
                "hero_secondary_cta": "ارتباط با من",
                "activity_summary_title": "خلاصه فعالیت‌های من",
                "activity_summary_text": (
                    "تمرکز اصلی من طراحی و توسعه محصولات production با نگاه بک‌اند‌محور است؛ "
                    "از معماری و APIهای پایدار تا بهینه‌سازی عملکرد و تجربه کاربری حرفه‌ای."
                ),
                "about_highlights": [
                    {
                        "title": "سیستم‌های بک‌اند",
                        "description": "Django، DRF، PostgreSQL و Redis — APIهایی مقیاس‌پذیر، خوانا و قابل نگهداری.",
                    },
                    {
                        "title": "تحویل فول‌استک",
                        "description": "فرانت‌اند Next.js و React همراه با APIهای قوی و جریان محتوای مدیریت‌شده از ادمین.",
                    },
                    {
                        "title": "SEO و رشد دیجیتال",
                        "description": "گواهی‌دار Google در بازاریابی دیجیتال با تجربه عملی در SEO فنی و استراتژی محتوا.",
                    },
                ],
                "github_url": "https://github.com/kakashi708",
                "linkedin_url": "https://www.linkedin.com/in/morteza-kamalian-ab5a7b55",
            },
        ]

        for data in profiles:
            Profile.objects.update_or_create(language=data["language"], defaults=data)

        skills = [
            ("en", "Python", "Backend", 95),
            ("en", "Django", "Backend", 95),
            ("en", "DRF", "Backend", 90),
            ("en", "Next.js", "Frontend", 88),
            ("en", "React", "Frontend", 85),
            ("en", "JavaScript", "Frontend", 90),
            ("en", "HTML5", "Frontend", 92),
            ("en", "CSS3", "Frontend", 90),
            ("en", "Tailwind CSS", "Frontend", 88),
            ("en", "Bootstrap", "Frontend", 82),
            ("en", "PostgreSQL", "Database", 90),
            ("en", "Redis", "Backend", 85),
            ("en", "Docker", "DevOps", 85),
            ("en", "Nginx", "DevOps", 80),
            ("en", "MySQL", "Database", 85),
            ("en", "Linux", "DevOps", 85),
            ("en", "Git", "Version Control", 85),
            ("fa", "Python", "بک‌اند", 95),
            ("fa", "Django", "بک‌اند", 95),
            ("fa", "DRF", "بک‌اند", 90),
            ("fa", "Next.js", "فرانت‌اند", 88),
            ("fa", "React", "فرانت‌اند", 85),
            ("fa", "JavaScript", "فرانت‌اند", 90),
            ("fa", "HTML5", "فرانت‌اند", 92),
            ("fa", "CSS3", "فرانت‌اند", 90),
            ("fa", "Tailwind CSS", "فرانت‌اند", 88),
            ("fa", "Bootstrap", "فرانت‌اند", 82),
            ("fa", "PostgreSQL", "پایگاه داده", 90),
            ("fa", "Redis", "بک‌اند", 85),
            ("fa", "Docker", "DevOps", 85),
            ("fa", "Nginx", "DevOps", 80),
            ("fa", "MySQL", "پایگاه داده", 85),
            ("fa", "Linux", "DevOps", 85),
            ("fa", "Git", "کنترل نسخه", 85),
        ]

        for index, (language, name, category, proficiency) in enumerate(skills):
            Skill.objects.update_or_create(
                language=language,
                name=name,
                defaults={
                    "category": category,
                    "proficiency": proficiency,
                    "order": index,
                },
            )

        projects = [
            {
                "language": "en",
                "slug": "portfolio-platform",
                "title": "kamalian.dev Portfolio Platform",
                "summary": "Bilingual portfolio and content platform with DRF, Next.js, PostgreSQL, and Docker.",
                "description": PROJECT_DESCRIPTION_EN,
                "tech_stack": [
                    "Django",
                    "DRF",
                    "Next.js",
                    "React",
                    "PostgreSQL",
                    "Docker",
                    "Tailwind CSS",
                ],
                "live_url": "https://kamalian.dev",
                "repo_url": "https://github.com/kakashi708",
                "is_featured": True,
                "order": 1,
                "translation_group_id": PROJECT_GROUP_ID,
            },
            {
                "language": "fa",
                "slug": "portfolio-platform",
                "title": "پلتفرم پورتفولیو kamalian.dev",
                "summary": "پورتفولیو و پلتفرم محتوای دوزبانه با DRF، Next.js، PostgreSQL و Docker.",
                "description": PROJECT_DESCRIPTION_FA,
                "tech_stack": [
                    "Django",
                    "DRF",
                    "Next.js",
                    "React",
                    "PostgreSQL",
                    "Docker",
                    "Tailwind CSS",
                ],
                "live_url": "https://kamalian.dev",
                "repo_url": "https://github.com/kakashi708",
                "is_featured": True,
                "order": 1,
                "translation_group_id": PROJECT_GROUP_ID,
            },
            {
                "language": "en",
                "slug": "levelhaft",
                "title": "LevelHaft Skincare E-commerce",
                "summary": "Production Persian e-commerce for skincare with OTP auth, dual-tier pricing, Pasargad payments, wallet, and business discounts.",
                "description": LEVELHAFT_DESCRIPTION_EN,
                "tech_stack": [
                    "Django",
                    "PostgreSQL",
                    "Bootstrap 5",
                    "Kavenegar",
                    "Pasargad PEP",
                    "WhiteNoise",
                    "Gunicorn",
                    "Liara",
                ],
                "live_url": "https://levelhaft.com",
                "repo_url": "https://github.com/morteza708/levelhaft",
                "is_featured": True,
                "order": 2,
                "translation_group_id": LEVELHAFT_GROUP_ID,
            },
            {
                "language": "fa",
                "slug": "levelhaft",
                "title": "فروشگاه آنلاین لول هفت",
                "summary": "فروشگاه production فارسی محصولات مراقبت پوست با OTP، قیمت‌گذاری بیوتیشن، درگاه پاسارگاد، کیف پول و تخفیف بیزنس.",
                "description": LEVELHAFT_DESCRIPTION_FA,
                "tech_stack": [
                    "Django",
                    "PostgreSQL",
                    "Bootstrap 5",
                    "Kavenegar",
                    "Pasargad PEP",
                    "WhiteNoise",
                    "Gunicorn",
                    "Liara",
                ],
                "live_url": "https://levelhaft.com",
                "repo_url": "https://github.com/morteza708/levelhaft",
                "is_featured": True,
                "order": 2,
                "translation_group_id": LEVELHAFT_GROUP_ID,
            },
        ]

        for data in projects:
            Project.objects.update_or_create(
                language=data["language"],
                slug=data["slug"],
                defaults=data,
            )

        published_at = timezone.now()
        articles = [
            {
                "language": "en",
                "slug": "building-kamalian-dev",
                "title": "Building kamalian.dev: A Bilingual Portfolio Stack",
                "excerpt": "How I structured Django, DRF, Next.js, and Docker for a bilingual portfolio with SEO-ready content.",
                "content": ARTICLE_CONTENT_EN,
                "tags": ["Django", "DRF", "Next.js", "Docker", "SEO"],
                "meta_title": "Building kamalian.dev | Portfolio Architecture",
                "meta_description": "A walkthrough of the bilingual Django + Next.js portfolio stack with API-driven content and SEO metadata.",
                "is_published": True,
                "published_at": published_at,
                "translation_group_id": ARTICLE_GROUP_ID,
            },
            {
                "language": "fa",
                "slug": "building-kamalian-dev",
                "title": "ساخت kamalian.dev: استک پورتفولیوی دوزبانه",
                "excerpt": "چطور Django، DRF، Next.js و Docker را برای پورتفولیوی دوزبانه با محتوای آماده SEO پیاده‌سازی کردم.",
                "content": ARTICLE_CONTENT_FA,
                "tags": ["Django", "DRF", "Next.js", "Docker", "SEO"],
                "meta_title": "ساخت kamalian.dev | معماری پورتفولیو",
                "meta_description": "مروری بر استک پورتفولیوی دوزبانه Django + Next.js با محتوای API-driven و متادیتای SEO.",
                "is_published": True,
                "published_at": published_at,
                "translation_group_id": ARTICLE_GROUP_ID,
            },
        ]

        for data in articles:
            Article.objects.update_or_create(
                language=data["language"],
                slug=data["slug"],
                defaults=data,
            )

        experiences = [
            {
                "language": "en",
                "company": "Freelance",
                "role": "Senior Software Developer",
                "location": "Iran",
                "description": "Building full-stack products, REST APIs, and bilingual web platforms for clients using Django, DRF, and Next.js.",
                "start_date": date(2024, 7, 1),
                "end_date": None,
                "is_current": True,
                "order": 1,
            },
            {
                "language": "en",
                "company": "Farassoo Tech",
                "role": "Software Developer",
                "location": "Tehran, Iran",
                "description": "Developed and maintained web applications and backend services in an IT consulting environment.",
                "start_date": date(2022, 4, 1),
                "end_date": date(2024, 7, 1),
                "is_current": False,
                "company_url": "https://www.linkedin.com/company/farassoo-tech",
                "order": 2,
            },
            {
                "language": "en",
                "company": "NIKAN",
                "role": "Project Manager",
                "location": "Tehran, Iran",
                "description": "Led cross-functional software projects, coordinated delivery timelines, and aligned technical teams with business goals.",
                "start_date": date(2019, 10, 1),
                "end_date": date(2022, 4, 1),
                "is_current": False,
                "company_url": "https://www.linkedin.com/company/nikan",
                "order": 3,
            },
            {
                "language": "en",
                "company": "Atlas Mall",
                "role": "Sales Marketing Manager",
                "location": "Tehran, Iran",
                "description": "Managed marketing campaigns, sales operations, and customer-facing digital initiatives.",
                "start_date": date(2015, 1, 1),
                "end_date": date(2019, 9, 1),
                "is_current": False,
                "order": 4,
            },
            {
                "language": "fa",
                "company": "فریلنس",
                "role": "توسعه‌دهنده ارشد نرم‌افزار",
                "location": "ایران",
                "description": "توسعه محصولات فول‌استک، APIهای REST و پلتفرم‌های وب دوزبانه با Django، DRF و Next.js.",
                "start_date": date(2024, 7, 1),
                "end_date": None,
                "is_current": True,
                "order": 1,
            },
            {
                "language": "fa",
                "company": "فراسو تک",
                "role": "توسعه‌دهنده نرم‌افزار",
                "location": "تهران، ایران",
                "description": "توسعه و نگهداری اپلیکیشن‌های وب و سرویس‌های بک‌اند در محیط مشاوره IT.",
                "start_date": date(2022, 4, 1),
                "end_date": date(2024, 7, 1),
                "is_current": False,
                "company_url": "https://www.linkedin.com/company/farassoo-tech",
                "order": 2,
            },
            {
                "language": "fa",
                "company": "NIKAN",
                "role": "مدیر پروژه",
                "location": "تهران، ایران",
                "description": "رهبری پروژه‌های نرم‌افزاری، هماهنگی تیم‌ها و هم‌راستایی اهداف فنی با نیازهای کسب‌وکار.",
                "start_date": date(2019, 10, 1),
                "end_date": date(2022, 4, 1),
                "is_current": False,
                "company_url": "https://www.linkedin.com/company/nikan",
                "order": 3,
            },
            {
                "language": "fa",
                "company": "اطلس مال",
                "role": "مدیر بازاریابی و فروش",
                "location": "تهران، ایران",
                "description": "مدیریت کمپین‌های بازاریابی، عملیات فروش و ابتکارات دیجیتال مشتری‌محور.",
                "start_date": date(2015, 1, 1),
                "end_date": date(2019, 9, 1),
                "is_current": False,
                "order": 4,
            },
        ]

        for data in experiences:
            Experience.objects.update_or_create(
                language=data["language"],
                company=data["company"],
                role=data["role"],
                start_date=data["start_date"],
                defaults=data,
            )

        education_entries = [
            {
                "language": "en",
                "institution": "Islamic Azad University, Science and Research Branch",
                "degree": "Bachelor's Degree",
                "field_of_study": "Plastics and Polymer Engineering Technology",
                "start_year": 2003,
                "end_year": 2008,
                "location": "Tehran, Iran",
                "description": "Engineering foundation with strong analytical and problem-solving skills applied later in software development.",
                "order": 1,
            },
            {
                "language": "fa",
                "institution": "دانشگاه آزاد اسلامی واحد علوم و تحقیقات",
                "degree": "کارشناسی",
                "field_of_study": "مهندسی تکنولوژی پلاستیک و پلیمر",
                "start_year": 2003,
                "end_year": 2008,
                "location": "تهران، ایران",
                "description": "پایه مهندسی با توان تحلیل و حل مسئله که بعدها در مسیر توسعه نرم‌افزار به کار گرفته شد.",
                "order": 1,
            },
        ]

        for data in education_entries:
            Education.objects.update_or_create(
                language=data["language"],
                institution=data["institution"],
                degree=data["degree"],
                defaults=data,
            )

        certifications = [
            {
                "language": "en",
                "name": "Fundamentals of Digital Marketing",
                "issuer": "Google",
                "issued_at": date(2023, 3, 1),
                "credential_url": "https://skillshop.exceedlms.com/",
                "skills": ["SEO", "Digital Marketing", "Analytics", "Content Strategy"],
                "description": "Google-certified training covering SEO fundamentals, search visibility, analytics, and data-driven marketing decisions.",
                "is_featured": True,
                "order": 1,
            },
            {
                "language": "fa",
                "name": "مبانی بازاریابی دیجیتال",
                "issuer": "Google",
                "issued_at": date(2023, 3, 1),
                "credential_url": "https://skillshop.exceedlms.com/",
                "skills": ["SEO", "بازاریابی دیجیتال", "تحلیل داده", "استراتژی محتوا"],
                "description": "دوره معتبر Google شامل اصول SEO، بهبود دیده‌شدن در جستجو، تحلیل داده و تصمیم‌گیری مبتنی بر بازاریابی دیجیتال.",
                "is_featured": True,
                "order": 1,
            },
        ]

        for data in certifications:
            Certification.objects.update_or_create(
                language=data["language"],
                name=data["name"],
                issuer=data["issuer"],
                defaults=data,
            )

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))
