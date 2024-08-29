import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Añadir Toast para notificaciones
import api from '../services/api';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [validationError, setValidationError] = useState(''); // Para almacenar mensajes de error de validación

    useEffect(() => {
        api.get('/products').then(response => {
            setProducts(response.data);
        });
        api.get('/categories').then(response => {
            setCategories(response.data);
        });
    }, []);

    const saveProduct = () => {
        if (newProductName.trim() === '') {
            setValidationError('El nombre del producto es obligatorio.');
            return;
        }

        if (!selectedCategoryId) {
            setValidationError('La categoría es obligatoria.');
            return;
        }

        setValidationError(''); // Limpiar el error si la validación pasa

        if (selectedProduct) {
            api.put(`/products/${selectedProduct.id}`, { name: newProductName, categoryId: selectedCategoryId }).then(() => {
                setProducts(products.map(prod => prod.id === selectedProduct.id ? { ...prod, name: newProductName, categoryId: selectedCategoryId, categoryName: categories.find(cat => cat.id === selectedCategoryId)!.name } : prod));
                setShowDialog(false);
                setSelectedProduct(null);
            });
        } else {
            api.post('/products', { name: newProductName, categoryId: selectedCategoryId }).then(response => {
                setProducts([...products, { ...response.data, categoryName: categories.find(cat => cat.id === selectedCategoryId)!.name }]);
                setShowDialog(false);
            });
        }
    };

    const deleteProduct = (id: number) => {
        api.delete(`/products/${id}`).then(() => {
            setProducts(products.filter(prod => prod.id !== id));
        });
    };

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => { setSelectedProduct(rowData); setNewProductName(rowData.name); setSelectedCategoryId(rowData.categoryId); setShowDialog(true); }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteProduct(rowData.id)} />
            </>
        );
    };

    return (
        <div className="p-grid p-justify-center p-mt-5">
            <div className="p-col-12 p-md-10">
                <div className="p-d-flex p-ai-center p-jc-between p-mb-3">
                    <h2>Productos</h2>
                    <Button label="Agregar Producto" icon="pi pi-plus" className="p-button-primary" onClick={() => { setSelectedProduct(null); setNewProductName(''); setSelectedCategoryId(null); setShowDialog(true); }} />
                </div>
                <DataTable value={products} paginator rows={10} className="p-mt-2" emptyMessage="No hay productos disponibles.">
                    <Column field="id" header="ID"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="categoryName" header="Categoría"></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
                <Dialog header={selectedProduct ? "Editar Producto" : "Nuevo Producto"} visible={showDialog} style={{ width: '30vw' }} footer={<Button label="Guardar" onClick={saveProduct} />} onHide={() => setShowDialog(false)}>
                    <div className="p-field">
                        <label htmlFor="name">Nombre</label>
                        <InputText id="name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="category">Categoría</label>
                        <Dropdown id="category" value={selectedCategoryId} options={categories.map(cat => ({ label: cat.name, value: cat.id }))} onChange={(e) => setSelectedCategoryId(e.value)} placeholder="Seleccione una Categoría" />
                    </div>
                    {validationError && <small className="p-error">{validationError}</small>}
                </Dialog>
            </div>
        </div>
    );
}

export default Products;
