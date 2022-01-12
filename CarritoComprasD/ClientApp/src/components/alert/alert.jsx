import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { alertService } from '@services';
import { history } from '@helpers';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@mui/material/Alert';


const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    fade: true
};

function Aviso(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

  function Alert({ id, fade }) {
    const [alerts, setAlerts] = useState([]);
    const [open, setOpen] = React.useState(true);
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    useEffect(() => {

        // subscribe a nuevas alertas
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {

                setOpen(true); //Seteo el open en TRUE

                // clear alerts when an empty alert is received
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filter out alerts without 'keepAfterRouteChange' flag
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // remove 'keepAfterRouteChange' flag on the rest
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);

                        
                        return filteredAlerts;
                    });
                } else {
                    // add alert to array
                    setAlerts(alerts => ([...alerts, alert]));

                    // auto close alert if required
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });

        // clear alerts on location change
        const historyUnlisten = history.listen(({ pathname }) => {

           
            // don't clear if pathname has trailing slash because this will be auto redirected again
            if (pathname.endsWith('/')) return;

            alertService.clear(id);
        });

        // clean up function that runs when the component unmounts
        return () => {

            
            // unsubscribe & unlisten to avoid memory leaks
            subscription.unsubscribe();
            historyUnlisten();
        };
    }, []);

    function removeAlert(alert) {

        if (fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remove alert after faded out
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remove alert
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }


    if (!alerts.length) return null;

    return (


        <div className="container">
            <div className="m-3">
                {alerts.map((alert, index) =>
                    <Snackbar open={open}  onClose={handleClose} key={index}>
                        <Aviso onClose={handleClose} severity={alert.type.toLowerCase()} >
                            <span style={{fontSize: 15}} dangerouslySetInnerHTML={{__html: alert.message}}></span>
                        </Aviso>
                    </Snackbar>
                   
                )}
            </div>
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };