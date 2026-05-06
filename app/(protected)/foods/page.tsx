"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit2, Package, Tag, Scale } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { foodItemSchema } from "@/lib/validations";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type FoodItem = z.infer<typeof foodItemSchema> & { id: string };
type FormData = z.infer<typeof foodItemSchema>;

const categories = [
  "ALL",
  "PROTEINS",
  "CARBS",
  "FRUITS",
  "VEGETABLES",
  "DAIRY",
  "SNACKS",
  "BEVERAGES",
  "OTHER",
];

export default function FoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(foodItemSchema),
    defaultValues: {
      category: "PROTEINS",
      quantity: 1,
      unit: "grams",
    },
  });

  const fetchFoods = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      
      const res = await fetch(`/api/foods?${params.toString()}`);
      const json = await res.json();
      if (json.success) setFoods(json.data);
    } catch (error) {
      console.error("Failed to fetch foods", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search, categoryFilter]);

  const onSubmit = async (data: FormData) => {
    try {
      const url = editingFood ? `/api/foods/${editingFood.id}` : "/api/foods";
      const method = editingFood ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save food item");

      toast({
        title: "Success",
        description: `Food item ${editingFood ? "updated" : "added"} successfully.`,
        variant: "success",
      });

      setIsDialogOpen(false);
      setEditingFood(null);
      form.reset();
      fetchFoods();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save food item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast({ title: "Deleted", description: "Food item removed.", variant: "default" });
      fetchFoods();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };

  const openEditDialog = (food: FoodItem) => {
    setEditingFood(food);
    form.reset({
      name: food.name,
      category: food.category,
      quantity: food.quantity,
      unit: food.unit,
      calories: food.calories || undefined,
      protein: food.protein || undefined,
      carbs: food.carbs || undefined,
      fat: food.fat || undefined,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Food Inventory</h1>
          <p className="text-gray-400">Manage your available food for AI recommendations.</p>
        </div>
        <Button onClick={() => { setEditingFood(null); form.reset(); setIsDialogOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Food
        </Button>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Search foods..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map(c => ({ value: c, label: c.charAt(0) + c.slice(1).toLowerCase() }))}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 skeleton" />)}
        </div>
      ) : foods.length === 0 ? (
        <div className="glass-card py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Your inventory is empty</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            Add foods you currently have at home so the AI can suggest meals using available ingredients.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">Add Your First Item</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={food.id}
              className="glass-card p-5 group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white truncate pr-2">{food.name}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditDialog(food)} className="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default" className="gap-1 bg-gray-800 text-gray-300">
                  <Tag className="w-3 h-3" /> {food.category}
                </Badge>
                <Badge variant="outline" className="gap-1 border-gray-700 text-gray-400">
                  <Scale className="w-3 h-3" /> {food.quantity} {food.unit}
                </Badge>
              </div>

              {(food.calories || food.protein || food.carbs || food.fat) && (
                <div className="pt-3 border-t border-gray-800/50 grid grid-cols-4 gap-2 text-center text-xs">
                  {food.calories && <div><p className="text-gray-500">Kcal</p><p className="font-medium text-white">{food.calories}</p></div>}
                  {food.protein && <div><p className="text-gray-500">Pro</p><p className="font-medium text-white">{food.protein}g</p></div>}
                  {food.carbs && <div><p className="text-gray-500">Carb</p><p className="font-medium text-white">{food.carbs}g</p></div>}
                  {food.fat && <div><p className="text-gray-500">Fat</p><p className="font-medium text-white">{food.fat}g</p></div>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <DialogPrimitive.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-800 bg-gray-950 p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
              <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-white">
                {editingFood ? "Edit Food Item" : "Add Food Item"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-gray-400">
                Add details about your food inventory.
              </DialogPrimitive.Description>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g. Chicken Breast" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select id="category" {...form.register("category")} options={categories.filter(c => c !== "ALL").map(c => ({ value: c, label: c.charAt(0) + c.slice(1).toLowerCase() }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" step="0.1" {...form.register("quantity", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select id="unit" {...form.register("unit")} options={[{value: "grams", label: "Grams"}, {value: "pieces", label: "Pieces"}, {value: "ml", label: "ml"}, {value: "cups", label: "Cups"}]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories (optional)</Label>
                  <Input id="calories" type="number" {...form.register("calories", { valueAsNumber: true, setValueAs: v => v === "" ? undefined : parseInt(v) })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <DialogPrimitive.Close asChild>
                  <Button type="button" variant="ghost">Cancel</Button>
                </DialogPrimitive.Close>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Item"}
                </Button>
              </div>
            </form>
            
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
