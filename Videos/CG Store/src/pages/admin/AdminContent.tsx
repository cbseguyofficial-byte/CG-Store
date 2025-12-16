import { useState, useEffect } from "react";
import { Save, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaticPages, useUpdateStaticPage } from "@/hooks/useAdminContent";

const defaultContent: Record<string, string> = {
  privacy: "# Privacy Policy\n\nYour privacy is important to us...",
  terms: "# Terms & Conditions\n\nBy using our services...",
  eula: "# End User License Agreement\n\nThis agreement...",
  about: "# About CBSE GUY\n\nWe are dedicated to helping students...",
  footer: "© 2024 CBSE GUY. All Rights Reserved. Premium CBSE study materials for students.",
};

const AdminContent = () => {
  const { data: pages, isLoading } = useStaticPages();
  const updatePage = useUpdateStaticPage();
  
  const [content, setContent] = useState<Record<string, string>>({
    privacy: "",
    terms: "",
    eula: "",
    about: "",
    footer: "",
  });

  // Load content from database
  useEffect(() => {
    if (pages) {
      const newContent = { ...defaultContent };
      pages.forEach((page) => {
        if (newContent.hasOwnProperty(page.slug)) {
          newContent[page.slug] = page.content;
        }
      });
      setContent(newContent);
    }
  }, [pages]);

  const handleSave = (section: string) => {
    const titleMap: Record<string, string> = {
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      eula: "End User License Agreement",
      about: "About CBSE GUY",
      footer: "Footer Text",
    };
    
    updatePage.mutate({
      slug: section,
      content: content[section],
      title: titleMap[section],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-light-cyan">Content Management</h1>
        <p className="text-frosted-blue">Edit website content and pages</p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="bg-french-blue/50 border border-primary/20">
          <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-frosted-blue">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="terms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-frosted-blue">
            Terms
          </TabsTrigger>
          <TabsTrigger value="eula" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-frosted-blue">
            EULA
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-frosted-blue">
            About
          </TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-frosted-blue">
            Footer
          </TabsTrigger>
        </TabsList>

        {["privacy", "terms", "eula", "about"].map((section) => (
          <TabsContent key={section} value={section}>
            <Card className="bg-french-blue/50 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-light-cyan flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {section === "privacy" ? "Privacy Policy" :
                   section === "terms" ? "Terms & Conditions" :
                   section === "eula" ? "End User License Agreement" :
                   "About Page"}
                </CardTitle>
                <Button 
                  onClick={() => handleSave(section)} 
                  className="gap-2"
                  disabled={updatePage.isPending}
                >
                  <Save className="h-4 w-4" />
                  {updatePage.isPending ? "Saving..." : "Save"}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content[section]}
                  onChange={(e) => setContent({ ...content, [section]: e.target.value })}
                  rows={20}
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan font-mono"
                  placeholder={`Enter ${section} content (Markdown supported)...`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="footer">
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-light-cyan flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Footer Text
              </CardTitle>
              <Button 
                onClick={() => handleSave("footer")} 
                className="gap-2"
                disabled={updatePage.isPending}
              >
                <Save className="h-4 w-4" />
                {updatePage.isPending ? "Saving..." : "Save"}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content.footer}
                onChange={(e) => setContent({ ...content, footer: e.target.value })}
                rows={5}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                placeholder="Enter footer text..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
