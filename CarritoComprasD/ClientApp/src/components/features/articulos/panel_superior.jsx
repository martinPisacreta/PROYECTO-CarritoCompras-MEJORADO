import React, { useState, useEffect } from 'react';
import {  makeStyles,createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { InputAdornment } from '@material-ui/core';
import {Search} from "@material-ui/icons"
function PanelSuperior(props) {
    


    //la funcion "handleChange_Filtro" llama al Parent <ArticuloList/>
    function handleChange_Filtro(event) {
        props.handleChange_Filtro(event.target.value) 
    }

    const handleChange_Busqueda = e => {
        props.handleChange_Busqueda(e.target.value)  
    }

    //la funcion "handleChange_Utilidad" llama al Parent <ArticuloList/>
    function handleChange_Utilidad(e) {

        let valor = e.target.value;
        let max = e.target.max;
        
        if (!Number(valor)) { //si no es numerico sale
            return;
        }

        if(parseInt(valor) > parseInt(max)) { //si supero el maximo , sale
            return;
        }

        props.handleChange_Utilidad(valor)  

    }

    //esta funcion me marca toda la casilla de texto pintada en azul
    function handleClick_Utilidad (e)  {
        e.target.select();
      };

    

    const useStyles = makeStyles((theme) => ({
        busqueda: {
          '& > *': {
            margin: theme.spacing(1),
            width: '40ch',
          },
        },
        utilidad: {
            '& > *': {
              margin: theme.spacing(1),
              width: '30ch',
            },
          }
      }));

      const theme = createMuiTheme({
        typography: {
          fontSize: 21,
        },
      });

    

    const classes = useStyles();
    

    return (

            <>
            <ThemeProvider theme={theme}>
                <div>
                    <FormControl className={classes.busqueda}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Filtros
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            value={props.columna_To_valueInputBusqueda}
                            onChange={handleChange_Filtro}
                            style =  {{fontSize: 14, marginTop: `24px`}}
                        >
                        {props.columnas.map((column) => (
                            (column.id === 'marcaArticulo' ||  column.id === 'codigoArticulo' ||  column.id === 'descripcionArticulo') && 
                            <MenuItem value={column.id} key={column.id}>
                                {column.label}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.busqueda}>
                        <TextField 
                            id="standard-basic" 
                            placeholder="Buscar"
                            value={props.valueInputBusqueda}
                            onChange={handleChange_Busqueda}
                            InputProps={{
                                            style: {fontSize: 14}, // font size of input text
                                            startAdornment: <InputAdornment position="start"> <Search/></InputAdornment>
                                        }} 
                            InputLabelProps={{style: {fontSize: 14}}} // font size of input label
                            label="Buscar"
                            
                        />
                    </FormControl>
                    {
                        props.usuario && //si hay usuario cargado...
                        <FormControl className={classes.utilidad}> 
                            <TextField 
                                type='number'
                                placeholder="Utilidad"
                                value =  {props.utilidad}
                                onChange={handleChange_Utilidad}
                                onClick={handleClick_Utilidad}
                                inputProps={{
                                                style: {fontSize: 14},
                                                max: 100, 
                                                min: 1        
                                            }} // font size of input text
                                InputLabelProps={{style: {fontSize: 14}}} // font size of input label
                                label="Utilidad cargada por el usuario"
                            />
                        </FormControl>
                    }
                </div>
            </ThemeProvider>
          </>      
          
    )
  }
  
  export default PanelSuperior;

 