from rest_framework import serializers

from .fields import MediaPathField
from .models import Article, Certification, ContactMessage, Education, Experience, Profile, Project, Skill


class ProfileSerializer(serializers.ModelSerializer):
    avatar = MediaPathField(read_only=True)
    resume_file = MediaPathField(read_only=True)
    activity_summary_image = MediaPathField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "full_name",
            "title",
            "tagline",
            "bio",
            "email",
            "location",
            "timezone",
            "availability_status",
            "hero_primary_cta",
            "hero_secondary_cta",
            "activity_summary_title",
            "activity_summary_text",
            "activity_summary_image",
            "github_url",
            "linkedin_url",
            "avatar",
            "about_highlights",
            "resume_file",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "company",
            "role",
            "location",
            "description",
            "start_date",
            "end_date",
            "is_current",
            "company_url",
            "order",
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "institution",
            "degree",
            "field_of_study",
            "start_year",
            "end_year",
            "location",
            "description",
            "order",
        ]


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            "name",
            "issuer",
            "issued_at",
            "credential_url",
            "skills",
            "description",
            "is_featured",
            "order",
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["name", "category", "proficiency", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    cover_image = MediaPathField(read_only=True)
    cover_image_thumb = MediaPathField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "slug",
            "title",
            "summary",
            "tech_stack",
            "live_url",
            "repo_url",
            "cover_image",
            "cover_image_thumb",
            "is_featured",
            "order",
        ]


class ProjectDetailSerializer(ProjectListSerializer):
    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + ["description", "translation_group_id"]


class ArticleListSerializer(serializers.ModelSerializer):
    cover_image = MediaPathField(read_only=True)
    cover_image_thumb = MediaPathField(read_only=True)

    class Meta:
        model = Article
        fields = [
            "slug",
            "title",
            "excerpt",
            "cover_image",
            "cover_image_thumb",
            "tags",
            "published_at",
        ]


class ArticleDetailSerializer(ArticleListSerializer):
    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + [
            "content",
            "meta_title",
            "meta_description",
            "translation_group_id",
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]

    def validate_name(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return cleaned

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def validate_subject(self, value: str) -> str:
        return value.strip()

    def validate_message(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return cleaned

    def create(self, validated_data):
        return ContactMessage.objects.create(**validated_data)
