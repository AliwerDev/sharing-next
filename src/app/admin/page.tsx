"use client";

import React, { useState, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  useGetProfile, 
  useGetCategories, 
  useGetReports, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory, 
  useDeleteReport, 
  useDeleteItem 
} from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  Tag, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Loader2, 
  FileText, 
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function getImageUrl(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80";
  if (url.startsWith('/uploads')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${backendUrl}${url}`;
  }
  return url;
}

function AdminContent() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfile();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();
  const { data: reports = [], isLoading: isReportsLoading } = useGetReports();

  // Mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const deleteReportMutation = useDeleteReport();
  const deleteItemMutation = useDeleteItem();

  // Tab & Modal State
  const [activeTab, setActiveTab] = useState<"reports" | "categories">("reports");
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading admin authorization...</p>
        </div>
      </div>
    );
  }

  // Access Denied if user role is not admin
  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ShieldAlert className="w-20 h-20 text-destructive mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Access Denied</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            You must have administrator privileges to view this portal. If you think this is an error, please contact support.
          </p>
          <Link href="/discover">
            <Button className="rounded-2xl px-8 py-6 text-lg hover-lift tactile-scale">
              Return to Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Action handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await createCategoryMutation.mutateAsync({ name: newCatName });
      toast.success(`Category "${newCatName}" created successfully!`);
      setNewCatName("");
      setIsAddingCategory(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create category.");
    }
  };

  const handleUpdateCategory = async (catId: string) => {
    if (!editingCatName.trim()) return;
    try {
      await updateCategoryMutation.mutateAsync({ id: catId, name: editingCatName });
      toast.success("Category updated successfully!");
      setEditingCatId(null);
      setEditingCatName("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category.");
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoryMutation.mutateAsync(catId);
      toast.success("Category deleted.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category.");
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await deleteReportMutation.mutateAsync(reportId);
      toast.success("Report dismissed successfully.");
    } catch (err: any) {
      toast.error("Failed to dismiss report.");
    }
  };

  const handleDeleteListing = async (itemId: string, reportId: string) => {
    if (!confirm("Are you sure you want to delete this reported listing from the system?")) return;
    try {
      await deleteItemMutation.mutateAsync(itemId);
      toast.success("Listing removed from ShareFlow.");
    } catch (err: any) {
      toast.error("Failed to delete listing.");
    }
  };

  const isPageLoading = isCategoriesLoading || isReportsLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Admin Moderation Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage system categories and review flagged community reports.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-muted p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "reports"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "categories"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="w-4 h-4" /> Categories ({categories.length})
            </button>
          </div>
        </div>

        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Fetching records...</p>
          </div>
        ) : activeTab === "reports" ? (
          /* REPORTS TAB */
          reports.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="glass-effect rounded-2xl p-6 border border-border flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Flagged Listing
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold line-clamp-1">
                        {report.item?.title || "Deleted Item"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {report.item?.description || "This item is no longer available."}
                      </p>
                    </div>

                    <div className="p-4 bg-destructive/5 border border-destructive/15 rounded-xl">
                      <span className="text-xs font-bold text-destructive uppercase tracking-wider block mb-1">
                        Reason for Report
                      </span>
                      <p className="text-sm italic text-foreground/80">
                        &quot;{report.reason}&quot;
                      </p>
                    </div>

                    {report.item && (
                      <div className="flex gap-4 items-center">
                        {report.item.images?.[0] && (
                          <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                            <img 
                              src={getImageUrl(report.item.images[0].image_url)} 
                              alt="Item preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="text-xs space-y-0.5">
                          <p className="text-muted-foreground">
                            Owner: <span className="font-semibold text-foreground">{report.item.user?.full_name || "Unknown"}</span> ({report.item.user?.phone_number || "No contact info"})
                          </p>
                          <p className="text-muted-foreground">
                            Reporter: <span className="font-semibold text-foreground">{report.reporter?.full_name || "Unknown"}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => handleDismissReport(report.id)}
                      disabled={deleteReportMutation.isPending}
                      className="flex-1 rounded-xl text-sm border-border hover:bg-accent/40"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Dismiss Report
                    </Button>

                    {report.item && (
                      <Button
                        onClick={() => handleDeleteListing(report.item.id, report.id)}
                        disabled={deleteItemMutation.isPending}
                        className="flex-1 rounded-xl text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete Listing
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-effect rounded-2xl p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50 text-emerald-500" />
              <h3 className="text-xl font-bold mb-1 text-foreground">All Clear!</h3>
              <p>No listings are currently flagged for review.</p>
            </div>
          )
        ) : (
          /* CATEGORIES TAB */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Categories List</h2>
              {!isAddingCategory ? (
                <Button 
                  onClick={() => setIsAddingCategory(true)}
                  className="rounded-xl gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </Button>
              ) : null}
            </div>

            {/* Add Category Card */}
            {isAddingCategory && (
              <form 
                onSubmit={handleAddCategory}
                className="glass-effect rounded-2xl p-6 border border-primary/20 max-w-md"
              >
                <h3 className="font-semibold mb-4">Create New Category</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g., Household, Tools..."
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit"
                      disabled={createCategoryMutation.isPending}
                      className="rounded-xl flex-1"
                    >
                      {createCategoryMutation.isPending ? "Creating..." : "Save Category"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCatName("");
                      }}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="glass-effect rounded-2xl p-4 border border-border flex items-center justify-between gap-4 card-elevation"
                >
                  {editingCatId === cat.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-input-background border border-input rounded-lg text-sm focus:outline-none"
                      />
                      <button 
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCatId(null);
                          setEditingCatName("");
                        }}
                        className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-sm truncate">{cat.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.name);
                          }}
                          className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                          title="Rename Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 glass-effect border-b border-border h-16 flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20" />
            <span className="font-bold text-xl tracking-tight hidden sm:block opacity-50">ShareFlow</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Authenticating admin...</p>
        </div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
