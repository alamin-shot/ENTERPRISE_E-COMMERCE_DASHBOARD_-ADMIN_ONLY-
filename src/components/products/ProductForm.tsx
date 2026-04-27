"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ProductImageUpload } from "./ProductImageUpload";
import { productSchema, type ProductFormValues } from "@/lib/validators/product.schema";
import { useCreateProductMutation, useUpdateProductMutation } from "@/store/api/productApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProductFormOpen, setSelectedProduct } from "@/store/slices/productSlice";
import type { Product } from "@/types/product.types";

const STATUS_OPTIONS = ["active", "inactive", "draft", "archived"].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
const CATEGORY_OPTIONS = ["electronics", "clothing", "food", "furniture", "sports", "beauty", "other"].map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

interface ProductFormProps {
    editProduct?: Product | undefined;
}

export function ProductForm({ editProduct }: ProductFormProps) {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((s) => s.product.isFormOpen);
    const [imageUrl, setImageUrl] = useState<string | null>(editProduct?.images[0]?.url ?? null);

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const isLoading = isCreating || isUpdating;

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: editProduct ? {
            name: editProduct.name,
            description: editProduct.description,
            price: editProduct.price,
            comparePrice: editProduct.comparePrice ?? undefined,
            sku: editProduct.sku,
            stock: editProduct.stock,
            category: editProduct.category,
            status: editProduct.status,
            tags: editProduct.tags,
            weight: editProduct.weight ?? undefined,
        } : { status: "draft", category: "electronics", tags: [] },
    });

    const currentStatus = watch("status");
    const currentCategory = watch("category");

    useEffect(() => {
        if (!isOpen) { reset(); setImageUrl(null); }
    }, [isOpen, reset]);

    const onClose = () => {
        dispatch(setProductFormOpen(false));
        dispatch(setSelectedProduct(null));
    };

    const onSubmit = async (values: ProductFormValues) => {
        try {
            if (editProduct) {
                await updateProduct({ id: editProduct.id, payload: values }).unwrap();
            } else {
                await createProduct(values).unwrap();
            }
            onClose();
        } catch { /* toast handled by RTK Query */ }
    };

    return (
        <Modal.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Content size="lg">
                <Modal.Header
                    title={editProduct ? "Edit Product" : "Add Product"}
                    description={editProduct ? "Update product details" : "Fill in product information"}
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-6 py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                        <ProductImageUpload value={imageUrl} onChange={setImageUrl} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input label="Product Name" placeholder="Wireless Headphones" error={errors.name?.message} {...register("name")} />
                            </div>
                            <Input label="SKU" placeholder="SKU-0001" error={errors.sku?.message} {...register("sku")} />
                            <Input label="Stock" type="number" placeholder="100" error={errors.stock?.message}
                                {...register("stock", { valueAsNumber: true })} />
                            <Input label="Price ($)" type="number" step="0.01" placeholder="99.99" error={errors.price?.message}
                                {...register("price", { valueAsNumber: true })} />
                            <Input label="Compare Price ($)" type="number" step="0.01" placeholder="129.99" error={errors.comparePrice?.message}
                                {...register("comparePrice", { valueAsNumber: true })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select label="Category" options={CATEGORY_OPTIONS} value={currentCategory}
                                onValueChange={(v) => setValue("category", v as ProductFormValues["category"])}
                                error={errors.category?.message} />
                            <Select label="Status" options={STATUS_OPTIONS} value={currentStatus}
                                onValueChange={(v) => setValue("status", v as ProductFormValues["status"])}
                                error={errors.status?.message} />
                        </div>

                        <Textarea label="Description" placeholder="Product description..." rows={3}
                            error={errors.description?.message} showCount maxLength={2000}
                            {...register("description")} />
                    </div>

                    <Modal.Footer>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>
                            {editProduct ? "Save Changes" : "Create Product"}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root>
    );
}