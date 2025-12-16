import { useState, useRef } from "react";
import { Upload, File, Trash2, Link, FolderOpen, Loader2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminFiles, useUploadDigitalFile, useDeleteDigitalFile } from "@/hooks/useAdminFiles";

const AdminFiles = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const { data: files, isLoading, error } = useAdminFiles();
  const uploadFile = useUploadDigitalFile();
  const deleteFile = useDeleteDigitalFile();

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadFile.mutateAsync({ file });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = (id: string, filePath: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile.mutate({ id, filePath });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load files: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Digital Library</h1>
          <p className="text-frosted-blue">Manage digital files and attachments ({files?.length || 0} files)</p>
        </div>
        <Button onClick={handleUpload} className="gap-2" disabled={uploading}>
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.zip"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload Area */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardContent className="p-8">
          <div 
            className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleUpload}
          >
            <Upload className="h-12 w-12 text-frosted-blue mx-auto mb-4" />
            <p className="text-light-cyan mb-2">Drag and drop files here</p>
            <p className="text-sm text-frosted-blue mb-4">or click to browse</p>
            <Button variant="outline" className="border-primary/30 text-light-cyan">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      {files && files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="bg-french-blue/50 border-primary/20 hover:bg-french-blue/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-deep-twilight/50">
                    <File className="h-6 w-6 text-turquoise-surf" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-light-cyan text-sm truncate">{file.file_name}</p>
                    {file.description && (
                      <p className="text-xs text-frosted-blue mt-1 truncate">{file.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-sky-aqua border-sky-aqua/30 text-xs">
                        <Link className="h-3 w-3 mr-1" />
                        {file.product_count} products
                      </Badge>
                    </div>
                    <p className="text-xs text-frosted-blue mt-2">
                      Uploaded: {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/30 text-destructive text-xs"
                    onClick={() => handleDelete(file.id, file.file_path)}
                    disabled={deleteFile.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-french-blue/50 border-primary/20">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-frosted-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-light-cyan mb-2">No Files Yet</h3>
            <p className="text-frosted-blue mb-4">
              Upload your first digital file to get started.
            </p>
            <Button onClick={handleUpload}>Upload File</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFiles;
