import React from 'react';
import { Menubar } from 'primereact/menubar';

const Navbar: React.FC = () => {
    const items = [
        { label: 'Categorías', icon: 'pi pi-fw pi-tags', command: () => window.location.href = '/categories' },
        { label: 'Productos', icon: 'pi pi-fw pi-box', command: () => window.location.href = '/products' }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
}

export default Navbar;
