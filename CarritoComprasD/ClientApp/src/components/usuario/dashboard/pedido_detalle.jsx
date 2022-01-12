import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider } from '@mui/styles';
import { esES } from '@mui/material/locale';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


function PedidoDetalle(props) {

//#region STYLES
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      overflowX: "auto"
    },
    container: {
      maxHeight: 600
    },
    pagination: {
      fontSize: '14px',
    }
  }));
  
  const EstiloCelda = withStyles((theme) => ({
    head: {
      // backgroundColor: theme.palette.common.black,
      // color: theme.palette.common.white,
      color: '#959595',
      fontWeight: 400,
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
    body: {
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
    footer: {
      fontSize: '14px',
      fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
    },
  }))(TableCell);


  const EstiloFila = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    hover: {
      "&:hover": {
        backgroundColor: "#949ac9 !important",
        color: " #fff !important",
      },
    },
  }))(TableRow);

  const theme = createTheme({
    typography: {
      body2: {
        fontSize: '14px',
        fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif'
      }
    }
  }, esES);
//#endregion STYLES


//#region CONSTANTES-FUNCIONES ESTE JSX

    const columnas = [
        {
            id: 'cantidad',
            label: 'Cantidad',
            minWidth: 170,
            visible: 'true'
        },
        { 
            id: 'codigoArticulo', 
            label: 'Código Articulo', 
            minWidth: 170 , 
            visible: 'true'
        },
        { 
            id: 'descripcionArticulo', 
            label: 'Descripción Articulo', 
            minWidth: 100 , 
            visible: 'true' 
        },
        { 
            id: 'txtDescMarca', 
            label: 'Marca', 
            minWidth: 100, 
            visible: 'true'
        },
        { 
            id: 'txtDescFamilia', 
            label: 'Familia', 
            minWidth: 100, 
            visible: 'true'
        },
        {
            id: 'precioListaPorCoeficientePorMedioIva',
            label: 'Precio Costo',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
            visible: 'true'
          },
  ];

  const [pedidoDetalle,setPedidoDetalle] = useState([]);


  
  const handleClose_Dialog = () => {
    props.handleClose_Dialog(false) 
  };

  const classes = useStyles();

  useEffect(() => {

    // usuarioPedidosDetalleService.getByIdPedido(props.selectedRow.id_usuario_pedido)
    // .then(x => setPedidoDetalle(x))
    // .catch(error => {
    //   alertService.error(error);
    // });
    }, []);


  
//#endregion CONSTANTES-FUNCIONES ESTE JSX

  return (
    <div>
      <Dialog fullWidth={ true } maxWidth={"md"} onClose={handleClose_Dialog} aria-labelledby="customized-dialog-title" open={props.open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose_Dialog}>
          <span style={{fontWeight: 'bold', fontFamily: '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif',fontSize: '18px'}}>Pedido Detalle</span>
        </DialogTitle>
        <DialogContent dividers>
            <ThemeProvider theme={theme}>  {/* lo que este dentro de ThemeProvider , va es estar en ESPAÑOL */}
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            {columnas.map((column) => (
                                column.visible === 'true' &&
                                                <EstiloCelda
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth}}
                                                visible = {column.visible}     
                                                >
                                                {column.label}
                                                </EstiloCelda>
                                            
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            pedidoDetalle.map((pd,i) => {
                            return (
                            
                            <EstiloFila  hover role="checkbox" tabIndex={-1} key={i} >
                                {columnas.map((column) => {
                                const value = pd[column.id];
                                return (
                                    
                                    column.visible === 'true' &&
                                                    <EstiloCelda key={column.id} align={column.align}>
                                                        { 
                                                            value
                                                        }
                                                    </EstiloCelda>
                                );
                                })}
                            </EstiloFila>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
            </ThemeProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}



export default  PedidoDetalle ;