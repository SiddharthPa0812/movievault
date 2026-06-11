import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import EntryForm from "../components/EntryForm";
import LoadingSpinner from "../components/LoadingSpinner";

function ManageEntryPage() {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [searchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState({
    type: searchParams.get("type") || "Movie",
    watched_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(Boolean(entryId));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!entryId) return;
    const loadEntry = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/entries/${entryId}/`);
        setInitialValues({
          ...data,
          watched_date: data.watched_date,
        });
      } finally {
        setLoading(false);
      }
    };
    loadEntry();
  }, [entryId]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setMessage("");
    try {
      if (entryId) {
        await api.patch(`/entries/${entryId}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Entry updated successfully.");
      } else {
        await api.post("/entries/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Entry saved successfully.");
      }
      window.dispatchEvent(new Event("entries:changed"));
      setTimeout(() => navigate("/"), 800);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading entry..." />;
  if (!initialValues) return <EmptyState title="Entry missing" description="The selected entry could not be found." />;

  return (
    <div className="page-stack">
      <EntryForm initialValues={initialValues} onSubmit={handleSubmit} submitting={submitting} message={message} />
    </div>
  );
}

export default ManageEntryPage;
