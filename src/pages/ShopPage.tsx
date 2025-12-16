import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/shop/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const subjects = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Hindi", "Social Science", "Computer Science"];
const classes = ["8", "9", "10", "11", "12", "11-12"];
const boards = ["CBSE", "ICSE", "State Board"];
const formats = ["PDF", "PHYSICAL", "COMBO"];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products, isLoading } = useProducts();

  const toggleFilter = (value: string, array: string[], setArray: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setArray(array.filter((v) => v !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const filteredProducts = (products || []).filter((product) => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) && !product.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedClasses.length > 0 && !selectedClasses.includes(product.class)) {
      return false;
    }
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(product.subject)) {
      return false;
    }
    if (selectedBoards.length > 0 && !selectedBoards.includes(product.board)) {
      return false;
    }
    if (selectedFormats.length > 0 && !selectedFormats.includes(product.format)) {
      return false;
    }
    if (product.sale_price < priceRange[0] || product.sale_price > priceRange[1]) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setSelectedBoards([]);
    setSelectedFormats([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedClasses.length > 0 || selectedSubjects.length > 0 || selectedBoards.length > 0 || selectedFormats.length > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Class</h4>
        <div className="flex flex-wrap gap-2">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => toggleFilter(cls, selectedClasses, setSelectedClasses)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-all",
                selectedClasses.includes(cls)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {cls === "11-12" ? "11-12" : `Class ${cls}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-foreground">Subject</h4>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center gap-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={() => toggleFilter(subject, selectedSubjects, setSelectedSubjects)}
              />
              <Label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                {subject}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-foreground">Board</h4>
        <div className="flex flex-wrap gap-2">
          {boards.map((board) => (
            <button
              key={board}
              onClick={() => toggleFilter(board, selectedBoards, setSelectedBoards)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-all",
                selectedBoards.includes(board)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {board}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-foreground">Format</h4>
        <div className="flex flex-wrap gap-2">
          {formats.map((format) => (
            <button
              key={format}
              onClick={() => toggleFilter(format, selectedFormats, setSelectedFormats)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-all",
                selectedFormats.includes(format)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-foreground">Price Range</h4>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={50} />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="gradient-hero py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Shop All Books</h1>
          <p className="text-light-cyan/90">Browse our collection of premium CBSE study materials</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by book, class, subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
          </div>
          <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="lg:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <Card variant="default" className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-card p-6 animate-slide-up">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterContent />
                <Button onClick={() => setIsFilterOpen(false)} className="mt-6 w-full">Apply Filters</Button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden lg:flex">
                  Clear all filters
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <Card variant="default" className="py-16 text-center">
                <CardContent>
                  <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">Clear Filters</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
