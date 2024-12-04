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
import './Plataformas.css'; // Asegúrate de crear este archivo CSS para los estilos personalizados

const Plataformas = () => {
  const [plataformas, setPlataformas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedPlataforma, setSelectedPlataforma] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    GoogleSheetsService.getPlataformas().then(data => {
      setPlataformas(data);
      setLoading(false);
    });
  }, []);

  const openNew = () => {
    setSelectedPlataforma(null);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const savePlataforma = () => {
    if (selectedPlataforma.id) {
      GoogleSheetsService.updatePlataforma(selectedPlataforma.id, selectedPlataforma).then(() => {
        Swal.fire('Success', 'Plataforma updated successfully', 'success');
        setVisible(false);
      });
    } else {
      GoogleSheetsService.addPlataforma(selectedPlataforma).then(() => {
        Swal.fire('Success', 'Plataforma added successfully', 'success');
        setVisible(false);
      });
    }
  };

  const deletePlataforma = (id) => {
    GoogleSheetsService.deletePlataforma(id).then(() => {
      Swal.fire('Deleted', 'Plataforma deleted successfully', 'success');
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _plataforma = { ...selectedPlataforma };
    _plataforma[`${name}`] = val;
    setSelectedPlataforma(_plataforma);
  };

  const plataformaDialogFooter = (
    <React.Fragment>
      <Button icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button icon="pi pi-check" className="p-button-text" onClick={savePlataforma} />
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
      <DataTable value={plataformas} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
        globalFilterFields={['id', 'name']} header={header} emptyMessage="No plataformas found." className="p-datatable-sm p-datatable-gridlines">
        <Column field="id" header="ID" filter filterPlaceholder="ID" style={{ minWidth: '140px' }} showFilterMenu={false} />
        <Column field="name" header="Name" filter filterPlaceholder="Name" style={{ minWidth: '140px' }} showFilterMenu={false} />
        <Column
          body={(rowData) => (
            <div className="button-group">
              <Button icon={<EditIcon />} className="p-button-dark p-button-icon-only" onClick={() => setSelectedPlataforma(rowData)} />
              <Button icon={<DeleteIcon />} className="p-button-dark p-button-icon-only" onClick={() => deletePlataforma(rowData.id)} />
            </div>
          )}
        />
      </DataTable>

      <Dialog visible={visible} style={{ width: '450px' }} header="Plataforma Details" modal className="p-fluid" footer={plataformaDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={selectedPlataforma ? selectedPlataforma.name : ''} onChange={(e) => onInputChange(e, 'name')} required autoFocus className="centered-input" />
        </div>
      </Dialog>
    </div>
  );
};

export default Plataformas;