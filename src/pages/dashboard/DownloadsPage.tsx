import { Download, FileText, Calendar, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDownloads, useDownloadUrl } from "@/hooks/useDownloads";

const DownloadsPage = () => {
  const { data: downloads, isLoading } = useDownloads();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Download Center</h1>
        <p className="text-muted-foreground">
          Access your purchased digital content
        </p>
      </div>

      {/* Info Banner */}
      <Card variant="gradient" className="border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Download Policy</p>
            <p className="text-muted-foreground">
              Digital files become available only after order confirmation.
              Download links are time-limited for security.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="glass">
              <CardContent className="p-6 flex gap-4">
                <Skeleton className="h-16 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Downloads List */}
      {!isLoading && downloads && downloads.length > 0 && (
        <div className="space-y-4">
          {downloads.map((item) => (
            <DownloadCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!downloads || downloads.length === 0) && (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Downloads Yet</h3>
            <p className="text-muted-foreground mb-4">
              Your digital purchases will appear here once your order is
              confirmed.
            </p>
            <Button asChild>
              <a href="/shop">Browse Books</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DownloadsPage;

/* ---------------- DOWNLOAD CARD ---------------- */

function DownloadCard({ item }: { item: any }) {
  const { data: signedUrl, isLoading } = useDownloadUrl(item.file_path);

  return (
    <Card variant="glass" className="hover:shadow-card-hover transition-all">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Icon */}
          <div className="p-4 rounded-xl bg-primary/10 shrink-0">
            <FileText className="h-8 w-8 text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {item.product_title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(item.purchased_at).toLocaleDateString("en-IN")}
              </span>
              <span>•</span>
              <span>Order: {item.order_id}</span>
              <span>•</span>
              <span>{item.file_name}</span>
            </div>

            <div className="mt-3">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                Link valid for 1 hour
              </Badge>
            </div>
          </div>

          {/* Download */}
          <div className="shrink-0">
            <Button
              className="gap-2 w-full lg:w-auto"
              disabled={!signedUrl || isLoading}
              asChild={!!signedUrl}
            >
              {signedUrl ? (
                <a href={signedUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Preparing…
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
