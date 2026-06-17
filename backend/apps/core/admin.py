from django.contrib import admin

from .models import Article, Certification, ContactMessage, Education, Experience, Profile, Project, Skill


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "language", "title", "updated_at")
    fieldsets = (
        (
            "About Page",
            {
                "description": "Content and photo for the /about page.",
                "fields": (
                    "language",
                    "full_name",
                    "title",
                    "tagline",
                    "bio",
                    "avatar",
                    "about_highlights",
                ),
            },
        ),
        (
            "Home Hero",
            {
                "fields": (
                    "availability_status",
                    "hero_primary_cta",
                    "hero_secondary_cta",
                ),
            },
        ),
        (
            "Home Activity Summary",
            {
                "fields": (
                    "activity_summary_title",
                    "activity_summary_text",
                    "activity_summary_image",
                ),
            },
        ),
        (
            "Contact & Social",
            {"fields": ("email", "location", "timezone", "github_url", "linkedin_url", "resume_file")},
        ),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "company", "language", "start_date", "end_date", "is_current", "order")
    list_filter = ("language", "is_current")
    search_fields = ("company", "role", "description")
    ordering = ("language", "-start_date", "order")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("degree", "institution", "language", "end_year", "order")
    list_filter = ("language",)
    search_fields = ("institution", "degree", "field_of_study")
    ordering = ("language", "-end_year", "order")


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ("name", "issuer", "language", "issued_at", "is_featured", "order")
    list_filter = ("language", "is_featured")
    search_fields = ("name", "issuer", "description")
    ordering = ("language", "-is_featured", "-issued_at", "order")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "language", "category", "proficiency", "order")
    list_filter = ("language", "category")
    ordering = ("language", "order", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "is_featured", "is_published", "order")
    list_filter = ("language", "is_featured", "is_published")
    search_fields = ("title", "summary", "description")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("language", "title", "slug", "summary", "description", "cover_image")}),
        ("Links & Stack", {"fields": ("tech_stack", "live_url", "repo_url")}),
        ("Publishing", {"fields": ("is_featured", "is_published", "order", "translation_group_id")}),
    )


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "is_published", "published_at", "updated_at")
    list_filter = ("language", "is_published")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt", "content")
    fieldsets = (
        (None, {"fields": ("language", "title", "slug", "excerpt", "content", "cover_image", "tags")}),
        ("Publishing", {"fields": ("is_published", "published_at", "translation_group_id")}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "subject", "message", "created_at", "updated_at")
    actions = ["mark_as_read", "mark_as_unread"]

    def has_add_permission(self, request):
        return False

    @admin.action(description="Mark selected messages as read")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description="Mark selected messages as unread")
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
