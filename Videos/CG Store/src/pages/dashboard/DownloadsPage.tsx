import { Download, FileText, Calendar, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const downloads = [
  {
    id: 1,
    title: "CBSE Class 12 Physics - Complete Guide",
    orderId: "ORD-2024-001",
    purchaseDate: "Dec 5, 2024",
    expiresOn: "Dec 5, 2025",
    size: "45 MB",
    downloads: 2,
    maxDownloads: 5,
    adminNote: "This PDF is printable. For any issues, contact support.",
  },
  {
    id: 2,
    title: "CBSE Class 12 Chemistry - Comprehensive Notes",
    orderId: "ORD-2024-001",
    purchaseDate: "Dec 5, 2024",
    expiresOn: "Dec 5, 2025",
    size: "38 MB",
    downloads: 1,
    maxDownloads: 5,
    adminNote: null,
  },
  {
    id: 3,
    title: "JEE Advanced - Previous Year Papers",
    orderId: "ORD-2024-003",
    purchaseDate: "Nov 28, 2024",
    expiresOn: "Nov 28, 2025",
    size: "62 MB",
    downloads: 0,
    maxDownloads: 5,
    adminNote: "Includes solutions for all years 2015-2024.",
  },
  {
    id: 4,
    title: "CBSE Class 11 Mathematics - Formula Book",
    orderId: "ORD-2024-005",
    purchaseDate: "Nov 20, 2024",
    expiresOn: "Nov 20, 2025",
    size: "12 MB",
    downloads: 3,
    maxDownloads: 5,
    adminNote: null,
  },
];

const DownloadsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Download Center</h1>
        <p className="text-muted-foreground">Access your purchased digital content</p>
      </div>

      {/* Info Banner */}
      <Card variant="gradient" className="border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Download Policy</p>
            <p className="text-muted-foreground">
              Each digital product can be downloaded up to 5 times within 1 year of purchase. 
              Contact support if you need additional downloads.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Downloads List */}
      <div className="space-y-4">
        {downloads.map((item) => (
          <Card key={item.id} variant="glass" className="hover:shadow-card-hover transition-all">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Icon */}
                <div className="p-4 rounded-xl bg-primary/10 shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.purchaseDate}
                    </span>
                    <span>•</span>
                    <span>Order: {item.orderId}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge variant="outline" className="gap-1">
                      <Download className="h-3 w-3" />
                      {item.downloads}/{item.maxDownloads} downloads
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Expires: {item.expiresOn}
                    </Badge>
                  </div>

                  {item.adminNote && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="font-medium text-xs text-muted-foreground mb-1">Admin Note:</p>
                      <p>{item.adminNote}</p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="shrink-0">
                  <Button className="gap-2 w-full lg:w-auto" disabled={item.downloads >= item.maxDownloads}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {downloads.length === 0 && (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Downloads Yet</h3>
            <p className="text-muted-foreground mb-4">
              Your digital purchases will appear here after order confirmation.
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
