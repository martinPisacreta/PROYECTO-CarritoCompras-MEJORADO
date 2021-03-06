import React, { useState, useEffect } from 'react';
import { DataGrid ,esES } from '@mui/x-data-grid';
import {  usuarioPedidoActions } from '@actions';
import { connect } from 'react-redux';

import {  makeStyles } from '@mui/styles';
import PedidoDetalle from './pedido_detalle'
import {
  Paper
} from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';
import { usuarioService } from '@services'

const useStyles = makeStyles({
  dataGrid: {
           "&.MuiDataGrid-root":{
             fontSize: '1.4rem'
           },
           "& .MuiTablePagination-displayedRows":{
             fontSize: '1.4rem'
           },
           "& .MuiInputBase-root":{
             fontSize: '1.4rem'
           },
           '& .MuiDataGrid-cell:hover': {
             color: 'black',
           },
           '& .super-app-theme--header': {
             backgroundColor: '#39f',
           },
           '& .MuiDataGrid-columnHeaderTitle': {
             fontWeight: 'bold'
           },
           minWidth: 2000
        },
  root: {
          width: "100%",
          overflowX: "auto",
          height: 400
        }
 });


function Pedidos(props) {
  
  const {
    getPedidosByIdUsuario
  } = props

  const usuario = usuarioService.usuarioValue;

//data-grid
  const [page, setPage] = useState(0);
  const [filas, setFilas] = useState([]);
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const filasPerPage = 6;
//data-grid

  const [open, setOpen] = React.useState(false);
  const [idUsuarioPedidoSeleccionado,setIdUsuarioPedidoSeleccionado] = useState(0);

  useEffect( () => {

    const payload = {
      idUsuario: usuario.idUsuario,
      take: filasPerPage,
      skip : page
    }


    loadDataGrid(payload); 
  }, [page]);


  const valueFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const columns = [
    {
        field : "id", //este campo es el IdUsuarioPedido
        headerName: '#',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    { 
        field : "fechaPedido", //va
        headerName: 'Fecha Pedido',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "total", //va
        headerName: 'Total',
        type: 'number',
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
      field : "snFinalizado", //va
      headerName: 'Finalizado',
      type: 'string',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      sortable: false
    }
  ];


  async function loadDataGrid (payload) {
    let active = true;
      (async () => {
        setLoadingDataGrid(true);
        await getPedidosByIdUsuario(payload)
        .then(newRows => {
          if (!active) {
            return;
          }
    
          setFilas(newRows);
          setLoadingDataGrid(false)
        })
        .catch(() => {
          setFilas(null);
          setLoadingDataGrid(false)
        })
      })();

      return () => {
        active = false;
      };
  }



  const classes = useStyles();

  return (


    <div>
      <Helmet>
          <title>Encendido Alsina - Mi Cuenta</title>
      </Helmet>
      
      <h1 className="d-none">Encendido Alsina - Mi Cuenta</h1>
      
      <div className="main">
          <div>
              <PageHeader  subTitle="Mi Cuenta" />
              <Breadcrumb  parent1={  [ "Mi Cuenta", "usuario/dashboard" ] } />
          </div>
          <div className="page-content">
            <div className="container">
                 <h1>Pedidos</h1>
                  {
                    open &&
                    <PedidoDetalle 
                        idUsuarioPedidoSeleccionado = {idUsuarioPedidoSeleccionado}
                        open = {open}
                        setOpen = {setOpen}
                    />
                  }
                  <p className="text-danger">* Al hacer click sobre una fila , vera el detalle del pedido</p>
                  <Paper className={classes.root}>
                    <DataGrid
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      className={classes.dataGrid}
                      rows={filas ? filas.usuarioPedidos : []}
                      columns={columns}
                      pagination
                      pageSize={filasPerPage}
                      rowsPerPageOptions={[filasPerPage]}
                      rowCount={filas ? filas.total : 0}
                      paginationMode="server"
                      onPageChange={(newPage) => setPage(newPage)}
                      loading={loadingDataGrid}
                      page={page}
                      disableColumnMenu
                      onSelectionModelChange={(id) => {
                        setIdUsuarioPedidoSeleccionado(id[0])
                        setOpen(true);
                      }}
                  
                  />
                </Paper>
            </div>
          </div>
      </div>
    </div>
  );
}




const actionCreators = {
    getPedidosByIdUsuario: usuarioPedidoActions.getPedidosByIdUsuario
  }
  
export default connect(null, actionCreators)(Pedidos);


