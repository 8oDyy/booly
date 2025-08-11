export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      business_tags: {
        Row: {
          business_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          business_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          business_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_tags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          average_rating: number | null
          category_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          last_review_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          price: Database["public"]["Enums"]["price_level"] | null
          review_count: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          category_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_review_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price?: Database["public"]["Enums"]["price_level"] | null
          review_count?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          category_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_review_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price?: Database["public"]["Enums"]["price_level"] | null
          review_count?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_business_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      checks: {
        Row: {
          business_id: string | null
          created_at: string
          device_hash: string | null
          expires_at: string | null
          id: string
          ip: unknown | null
          scanned_at: string
          tag_id: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          device_hash?: string | null
          expires_at?: string | null
          id?: string
          ip?: unknown | null
          scanned_at?: string
          tag_id: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          device_hash?: string | null
          expires_at?: string | null
          id?: string
          ip?: unknown | null
          scanned_at?: string
          tag_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checks_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "scan_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      last_reviews: {
        Row: {
          business_id: string
          content: string | null
          created_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id: string
          content?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string
          content?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "last_reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "last_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          department: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string
          region: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code: string
          region: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string
          region?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      opening_hours: {
        Row: {
          business_id: string | null
          created_at: string | null
          day_of_week: number
          id: string
          opening_times: Json
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          opening_times: Json
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          opening_times?: Json
        }
        Relationships: [
          {
            foreignKeyName: "opening_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          review_id: string | null
          url: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          review_id?: string | null
          url: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          review_id?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          business_owner_id: string
          content: string
          created_at: string
          id: string
          review_id: string
          updated_at: string
        }
        Insert: {
          business_owner_id: string
          content: string
          created_at?: string
          id?: string
          review_id: string
          updated_at?: string
        }
        Update: {
          business_owner_id?: string
          content?: string
          created_at?: string
          id?: string
          review_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_business_owner_id_fkey"
            columns: ["business_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          check_id: string
          content: string | null
          created_at: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          check_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          check_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: true
            referencedRelation: "checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_tags: {
        Row: {
          business_id: string
          code: string
          created_at: string
          deactivated_at: string | null
          id: string
          label: string | null
          status: Database["public"]["Enums"]["tag_status"]
          type: Database["public"]["Enums"]["tag_type"]
          updated_at: string
        }
        Insert: {
          business_id: string
          code: string
          created_at?: string
          deactivated_at?: string | null
          id?: string
          label?: string | null
          status?: Database["public"]["Enums"]["tag_status"]
          type: Database["public"]["Enums"]["tag_type"]
          updated_at?: string
        }
        Update: {
          business_id?: string
          code?: string
          created_at?: string
          deactivated_at?: string | null
          id?: string
          label?: string | null
          status?: Database["public"]["Enums"]["tag_status"]
          type?: Database["public"]["Enums"]["tag_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_tags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          business_id: string
          has_review: boolean | null
          id: string
          user_id: string
          visited_at: string | null
        }
        Insert: {
          business_id: string
          has_review?: boolean | null
          id?: string
          user_id: string
          visited_at?: string | null
        }
        Update: {
          business_id?: string
          has_review?: boolean | null
          id?: string
          user_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_subscription: {
        Args: { subscription_id_param: string }
        Returns: {
          user_id: string
        }[]
      }
      create_or_update_subscription: {
        Args: {
          user_id_param: string
          customer_id_param: string
          subscription_id_param: string
          status_param: string
          plan_type_param: string
        }
        Returns: undefined
      }
      get_user_by_email: {
        Args: { email_param: string }
        Returns: {
          id: string
          email: string
        }[]
      }
    }
    Enums: {
      price_level: "4" | "1" | "2" | "3"
      tag_status: "active" | "inactive" | "replaced"
      tag_type: "QR" | "NFC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      price_level: ["4", "1", "2", "3"],
      tag_status: ["active", "inactive", "replaced"],
      tag_type: ["QR", "NFC"],
    },
  },
} as const
