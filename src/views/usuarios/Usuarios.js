import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import GoogleSheetsService from '../../services/googleSheetsService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './Usuarios.css'; // Asegúrate de crear este archivo CSS para los estilos personalizados

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    numeroCliente: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    GoogleSheetsService.getClientesConCuentas().then(data => {
      setUsuarios(data);
      setLoading(false);
    });
  }, []);

  const openNew = () => {
    setSelectedUsuario(null);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveUsuario = () => {
    if (selectedUsuario.id) {
      GoogleSheetsService.updateCliente(selectedUsuario.id, selectedUsuario).then(() => {
        Swal.fire('Success', 'Usuario updated successfully', 'success');
        setVisible(false);
      });
    } else {
      GoogleSheetsService.addCliente(selectedUsuario).then(() => {
        Swal.fire('Success', 'Usuario added successfully', 'success');
        setVisible(false);
      });
    }
  };

  const deleteUsuario = (id) => {
    GoogleSheetsService.deleteCliente(id).then(() => {
      Swal.fire('Deleted', 'Usuario deleted successfully', 'success');
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _usuario = { ...selectedUsuario };
    _usuario[`${name}`] = val;
    setSelectedUsuario(_usuario);
  };

  const usuarioDialogFooter = (
    <React.Fragment>
      <Button icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button icon="pi pi-check" className="p-button-text" onClick={saveUsuario} />
    </React.Fragment>
  );

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
        </IconField>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const header = renderHeader();

  return (
    <div className="datatable-crud-demo">
      <Button icon={<AddIcon />} className="p-button-dark mb-3 p-button-minimal" onClick={openNew} />
      <DataTable value={usuarios} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
        globalFilterFields={['id', 'email', 'numeroCliente', 'status']} header={header} emptyMessage="No usuarios found." className="p-datatable-sm p-datatable-gridlines">
        <Column field="id" header="ID" filter filterPlaceholder="ID" style={{ minWidth: '4rem' }} showFilterMenu={false} />
        <Column field="email" header="Email" filter filterPlaceholder="Email" style={{ minWidth: '8rem' }} showFilterMenu={false} />
        <Column field="numeroCliente" header="Número Cliente" filter filterPlaceholder="Número Cliente" style={{ minWidth: '10rem' }} showFilterMenu={false} />
        <Column field="status" header="Status" filter filterPlaceholder="Status" style={{ minWidth: '8rem' }} showFilterMenu={false} />
        <Column
          body={(rowData) => (
            <React.Fragment>
              <Button icon={<EditIcon />} className="p-button-dark mr-2 p-button-icon-only" onClick={() => setSelectedUsuario(rowData)} />
              <Button icon={<DeleteIcon />} className="p-button-dark p-button-icon-only" onClick={() => deleteUsuario(rowData.id)} />
            </React.Fragment>
          )}
        />
      </DataTable>

      <Dialog visible={visible} style={{ width: '450px' }} header="Usuario Details" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="idCuenta">ID Cuenta</label>
          <InputText id="idCuenta" value={selectedUsuario ? selectedUsuario.idCuenta : ''} onChange={(e) => onInputChange(e, 'idCuenta')} required autoFocus />
        </div>
        <div className="field">
          <label htmlFor="numeroCliente">Número Cliente</label>
          <InputText id="numeroCliente" value={selectedUsuario ? selectedUsuario.numeroCliente : ''} onChange={(e) => onInputChange(e, 'numeroCliente')} required />
        </div>
      </Dialog>
    </div>
  );
};

export default Usuarios;