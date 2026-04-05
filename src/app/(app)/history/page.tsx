'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { collection, doc } from "firebase/firestore";
import jsPDF from "jspdf";
import { Eye, MoreVertical, Trash2, Download, Loader2 } from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const tailoredResumesRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'tailoredResumes') : null, [firestore, user]);

  const { data: history, isLoading } = useCollection(tailoredResumesRef);

  const confirmDelete = () => {
    if (!itemToDelete || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'tailoredResumes', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "History item deleted." });
    setItemToDelete(null);
  };

  const handleDownloadPdf = (item: any) => {
    if (!item) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(item.tailoredContent, textWidth);
    doc.text(lines, margin, margin);

    const safeFileName = `${item.jobTitle.replace(/\s/g, '-')}-${item.company.replace(/\s/g, '-')}-resume.pdf`;
    doc.save(safeFileName);
    toast({
      title: 'Downloading PDF...',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold">Version History</h1>
          <p className="text-muted-foreground">
            Review and manage your previously tailored resumes.
          </p>
        </div>
        {history && history.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4">
                    <div className="flex-grow">
                        <CardTitle>{item.jobTitle}</CardTitle>
                        <CardDescription>{item.company}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPdf(item)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setItemToDelete(item)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="text-sm text-muted-foreground">
                        Created on {new Date(item.generatedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-4">
                        <Badge variant={item.atsScore > 90 ? "default" : item.atsScore > 80 ? "secondary" : "outline"}>
                            {item.atsScore}% ATS Score
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setSelectedItem(item)}>
                        <Eye className="mr-2 h-4 w-4" /> View Tailored Version
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
              <h3 className="text-lg font-semibold text-muted-foreground">No History Found</h3>
              <p className="text-sm text-muted-foreground">You haven't tailored any resumes yet.</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tailored Resume for {selectedItem.jobTitle}</DialogTitle>
              <DialogDescription>
                For {selectedItem.company}, generated on {new Date(selectedItem.generatedAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap font-body text-sm">
                    {selectedItem.tailoredContent}
                </pre>
            </div>
            <DialogFooter className="sm:justify-start">
                <Button variant="outline" onClick={() => handleDownloadPdf(selectedItem)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {itemToDelete && (
        <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the tailored resume
                        for "{itemToDelete.jobTitle}" at "{itemToDelete.company}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
