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
import './Cuentas.css'; // Asegúrate de crear este archivo CSS para los estilos personalizados

const Cuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    password: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    service: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    cost: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    rating: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    date: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    GoogleSheetsService.getCuentas().then(data => {
      setCuentas(data);
      setLoading(false);
    });
  }, []);

  const openNew = () => {
    setSelectedCuenta(null);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveCuenta = () => {
    if (selectedCuenta.id) {
      GoogleSheetsService.updateCuenta(selectedCuenta.id, selectedCuenta).then(() => {
        Swal.fire('Success', 'Cuenta updated successfully', 'success');
        setVisible(false);
      });
    } else {
      GoogleSheetsService.addCuenta(selectedCuenta).then(() => {
        Swal.fire('Success', 'Cuenta added successfully', 'success');
        setVisible(false);
      });
    }
  };

  const deleteCuenta = (id) => {
    GoogleSheetsService.deleteCuenta(id).then(() => {
      Swal.fire('Deleted', 'Cuenta deleted successfully', 'success');
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _cuenta = { ...selectedCuenta };
    _cuenta[`${name}`] = val;
    setSelectedCuenta(_cuenta);
  };

  const cuentaDialogFooter = (
    <div className="button-group">
      <Button label="Enviar" icon="pi pi-check" className="p-button-primary" onClick={saveCuenta} />
    </div>
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
      <DataTable value={cuentas} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
        globalFilterFields={['id', 'email', 'password', 'service', 'cost', 'status', 'rating', 'date']} header={header} emptyMessage="No cuentas found." className="p-datatable-sm p-datatable-gridlines">
        <Column field="id" header="ID" filter filterPlaceholder="ID" style={{ minWidth: '3rem' }} showFilterMenu={false} />
        <Column field="email" header="Email" filter filterPlaceholder="Email" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="password" header="Password" filter filterPlaceholder="Password" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="service" header="Service" filter filterPlaceholder="Service" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="cost" header="Cost" filter filterPlaceholder="Cost" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="status" header="Status" filter filterPlaceholder="Status" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="rating" header="Rating" filter filterPlaceholder="Rating" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column field="date" header="Date" filter filterPlaceholder="Date" style={{ minWidth: '6rem' }} showFilterMenu={false} />
        <Column
          body={(rowData) => (
            <div className="button-group">
              <Button icon={<EditIcon />} className="p-button-dark p-button-icon-only" onClick={() => setSelectedCuenta(rowData)} />
              <Button icon={<DeleteIcon />} className="p-button-dark p-button-icon-only" onClick={() => deleteCuenta(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      <Dialog visible={visible} style={{ width: '600px', backgroundColor: '#ffffff' }} modal className="p-fluid" footer={cuentaDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText id="email" value={selectedCuenta ? selectedCuenta.email : ''} onChange={(e) => onInputChange(e, 'email')} required autoFocus />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <InputText id="password" value={selectedCuenta ? selectedCuenta.password : ''} onChange={(e) => onInputChange(e, 'password')} required />
        </div>
        <div className="field">
          <label htmlFor="service">Service</label>
          <InputText id="service" value={selectedCuenta ? selectedCuenta.service : ''} onChange={(e) => onInputChange(e, 'service')} required />
        </div>
        <div className="field">
          <label htmlFor="cost">Cost</label>
          <InputText id="cost" value={selectedCuenta ? selectedCuenta.cost : ''} onChange={(e) => onInputChange(e, 'cost')} required />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <InputText id="status" value={selectedCuenta ? selectedCuenta.status : ''} onChange={(e) => onInputChange(e, 'status')} required />
        </div>
        <div className="field">
          <label htmlFor="rating">Rating</label>
          <InputText id="rating" value={selectedCuenta ? selectedCuenta.rating : ''} onChange={(e) => onInputChange(e, 'rating')} required />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <InputText id="date" value={selectedCuenta ? selectedCuenta.date : ''} onChange={(e) => onInputChange(e, 'date')} required />
        </div>
      </Dialog>
    </div>
  );
};

export default Cuentas;