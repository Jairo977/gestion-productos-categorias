import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Añadir Toast para notificaciones
import api from '../services/api';

interface Category {
    id: number;
    name: string;
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [validationError, setValidationError] = useState(''); // Para almacenar mensajes de error de validación

    useEffect(() => {
        api.get('/categories').then(response => {
            setCategories(response.data);
        });
    }, []);

    const saveCategory = () => {
        if (newCategoryName.trim() === '') {
            setValidationError('El nombre de la categoría es obligatorio.');
            return;
        }

        setValidationError(''); // Limpiar el error si la validación pasa

        if (selectedCategory) {
            api.put(`/categories/${selectedCategory.id}`, { name: newCategoryName }).then(() => {
                setCategories(categories.map(cat => cat.id === selectedCategory.id ? { ...cat, name: newCategoryName } : cat));
                setShowDialog(false);
                setSelectedCategory(null);
            });
        } else {
            api.post('/categories', { name: newCategoryName }).then(response => {
                setCategories([...categories, response.data]);
                setShowDialog(false);
            });
        }
    };

    const deleteCategory = (id: number) => {
        api.delete(`/categories/${id}`).then(() => {
            setCategories(categories.filter(cat => cat.id !== id));
        });
    };

    const actionBodyTemplate = (rowData: Category) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => { setSelectedCategory(rowData); setNewCategoryName(rowData.name); setShowDialog(true); }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteCategory(rowData.id)} />
            </>
        );
    };

    return (
        <div className="p-grid p-justify-center p-mt-5">
            <div className="p-col-12 p-md-10">
                <div className="p-d-flex p-ai-center p-jc-between p-mb-3">
                    <h2>Categorías</h2>
                    <Button label="Agregar Categoría" icon="pi pi-plus" className="p-button-primary" onClick={() => { setSelectedCategory(null); setNewCategoryName(''); setShowDialog(true); }} />
                </div>
                <DataTable value={categories} paginator rows={10} className="p-mt-2" emptyMessage="No hay categorías disponibles.">
                    <Column field="id" header="ID"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column body={actionBodyTemplate} header="Acciones"></Column>
                </DataTable>
                <Dialog header={selectedCategory ? "Editar Categoría" : "Nueva Categoría"} visible={showDialog} style={{ width: '30vw' }} footer={<Button label="Guardar" onClick={saveCategory} />} onHide={() => setShowDialog(false)}>
                    <div className="p-field">
                        <label htmlFor="name">Nombre</label>
                        <InputText id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                    </div>
                    {validationError && <small className="p-error">{validationError}</small>}
                </Dialog>
            </div>
        </div>
    );
}

export default Categories;
