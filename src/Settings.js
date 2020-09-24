import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
  }));


function Settings(props) {
    const classes = useStyles();
    const searchParams = new URLSearchParams(window.location.search);
    const getQueryParam = (key) => searchParams.get(key);

    const [setting1Value, updateSetting1] = useState(getQueryParam('setting1'));
    const [setting2Value, updateSetting2] = useState(getQueryParam('setting2'));
    if (!setting1Value) {
      updateSetting1(20);
    };
    if (!setting2Value) {
      updateSetting2("red");
    };

    function handleSettingsChange(setting, event) {
      if (setting == "setting1") {
        updateSetting1(event.target.value);
      }
      if (setting == "setting2") {
        updateSetting2(event.target.value);
      }
    }

    function saveSettings() {
      const isParent = (window.opener == null);
      const isIframe = (window !== window.parent);
      const isFramedApp = isIframe && isParent;
      if (isFramedApp) {
          const settings = {
            reload: false,
            setting1: setting1Value,
            setting2: setting2Value
          }
          window.parent.postMessage(
          {
              topic: '/clb/community-app/settings',
              data: settings
          },
          'https://wiki.ebrains.eu'
          );
      };
    };

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4" component="h2" gutterBottom>
                Settings
              </Typography>
              <Grid container direction="row" spacing={3}>
                <Grid item xs={2}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="setting1-label">Setting 1</InputLabel>
                  <Select
                    labelId="setting1-label"
                    id="setting1"
                    value={setting1Value}
                    onChange={(event) => handleSettingsChange("setting1", event)}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={2}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="setting2-label">Setting 2</InputLabel>
                  <Select
                    labelId="setting2-label"
                    id="setting2"
                    value={setting2Value}
                    onChange={(event) => handleSettingsChange("setting2", event)}
                  >
                    <MenuItem value="red">red</MenuItem>
                    <MenuItem value="green">green</MenuItem>
                    <MenuItem value="blue">blue</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={2}>
                  <Button variant="contained" onClick={() => {window.history.back();}}>Cancel</Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="primary" onClick={saveSettings}>Save changes</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
};

export default Settings;