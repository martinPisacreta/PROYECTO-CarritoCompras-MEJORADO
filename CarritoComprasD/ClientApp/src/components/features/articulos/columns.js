const usuario = JSON.parse(localStorage.getItem('user'));

const valueFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });


const columns = [

    {
        field : "id",
        hide: true
    },
    {
        field : "marcaArticulo", //va
        headerName: 'Marca',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    { 
        field : "codigoArticulo", //va
        headerName: 'Código',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "descripcionArticulo", //va
        headerName: 'Descripción',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    }, 
    {
        field : "familiaArticulo", //va
        headerName: 'Familia',
        type: 'string',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "precioListaPorCoeficientePorMedioIva", //va
        headerName: 'Precio Costo',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "utilidadArticulo", //va
        headerName: 'Precio Utilidad',
        type: 'number',
        hide : usuario ? false : true,
        valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
        flex: 1,
        headerClassName: 'super-app-theme--header',
        sortable: false
    },
    {
        field : "snOferta",
        /*
        type: 'number',
        headerName: 'Oferta',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        */
        hide: true
    },
    {
        field : "pathImagenArticulo",
        hide: true
    },
    {
      field : "precioLista",
      hide: true
    },
    {
      field : "coeficiente",
      hide: true
    },
    {
      field : "idTablaMarca",
      hide: true
    },
    {
      field : "idTablaFamilia",
      hide: true
    }
  ];

export default columns;