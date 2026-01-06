"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import JanazaForm from "@/components/admin/janaza/JanazaForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditJanazaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/janaza/${resolvedParams.id}`);
        const result = await response.json();

        if (result.success) {
          setData(result.notice);
        } else {
          toast.error("Failed to load janaza notice");
          router.push("/admin/janaza");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <JanazaForm initialData={data} isEditing={true} />
    </div>
  );
}
