import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Chip from '@material-ui/core/Chip';

import Slider from '@material-ui/core/Slider';

import Settings from './Settings';


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
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  leftAlign: {
    textAlign: 'left'
  }
}));

function App(props) {
  const classes = useStyles();

  if (window.location.pathname == "/settings") {
    return <Settings />
  }

  const searchParams = new URLSearchParams(window.location.search);
  const getQueryParam = (key) => searchParams.get(key);

  const userInfo = props.auth.tokenParsed;
  const teams = props.auth.userInfo.roles.team;
  teams.sort()

  let collabs = {
    viewer: [],
    editor: [],
    administrator: []
  };
  function sortRole(item) {
    const parts = item.split("-");
    const role = parts[parts.length - 1];
    const collab_id = parts.slice(1, parts.length - 1).join("-");
    return [role, collab_id]
  }
  teams.forEach(item => {
    let role, collab_id;
    [role, collab_id] = sortRole(item);
    collabs[role].push(collab_id);
  });
  console.log(collabs);

  function LabelledChip(props) {
    const value = props.value ? props.value : "unknown";
    const chipLabel = props.label + ": " + value;
    return (
      <Chip label={chipLabel} />
    )
  };

  function storeSliderState(event, value) {
    const isParent = (window.opener == null);
    const isIframe = (window !== window.parent);
    const isFramedApp = isIframe && isParent;
    if (isFramedApp) {
      const message = {
        topic: '/clb/community-app/hashchange',
        data: "slider:" + value
      }
      window.parent.postMessage(
        message,
        'https://wiki.ebrains.eu'
      );
    };
  };

  function getSliderState() {
    const regex = /slider:\d/g
    const found = window.location.hash.match(regex);
    if (found) {
      return parseInt(found[0].slice(7));
    } else {
      return 0;
    }
  };


  const sliderValue = getSliderState();

  let setting1Value = getQueryParam('setting1');
  if (!setting1Value) {
    setting1Value = 20;
  };
  let setting2Value = getQueryParam('setting2');
  if (!setting2Value) {
    setting2Value = "red";
  };

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h3" component="h1" gutterBottom>
              Collaboratory v2 demo app
            </Typography>
            <div className={classes.chips}>
              <LabelledChip label="Collab ID" value={getQueryParam('clb-collab-id')} />
              <LabelledChip label="Doc path" value={getQueryParam('clb-doc-path')} />
              <LabelledChip label="Doc name" value={getQueryParam('clb-doc-name')} />
              <LabelledChip label="Drive ID" value={getQueryParam('clb-drive-id')} />
              <LabelledChip label="Username" value={userInfo.preferred_username} />
              <LabelledChip label="Setting #1" value={setting1Value} />
              <LabelledChip label="Setting #2" value={setting2Value} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4" component="h2" gutterBottom>
              Storing state in URL
            </Typography>
            <Typography id="discrete-slider" gutterBottom>
            If using this app within the Collaboratory, the slider state is stored in the URL,
            so you can bookmark the page and return to a particular state of the slider.
            </Typography>
            <Slider
              defaultValue={sliderValue}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={9}
              onChangeCommitted={storeSliderState}
            />
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
          <Typography variant="h4" component="h2" gutterBottom>
              My Collabs
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom className={classes.leftAlign}>
              Administrator
          </Typography>
          <List component="nav" aria-label="secondary mailbox folders">
            {collabs.administrator.map((item, index) => {
              return (
                <ListItemLink key={index}  href={"https://wiki.ebrains.eu/bin/view/Collabs/" + item} target="_blank">
                  <ListItemText primary={item} />
                </ListItemLink>
              )
            })}
          </List>

          <Typography variant="h5" component="h3" gutterBottom className={classes.leftAlign}>
              Editor
          </Typography>
          <List component="nav" aria-label="secondary mailbox folders">
            {collabs.editor.map((item, index) => {
              return (
                <ListItemLink key={index}  href={"https://wiki.ebrains.eu/bin/view/Collabs/" + item} target="_blank">
                  <ListItemText primary={item} />
                </ListItemLink>
              )
            })}
          </List>

          <Typography variant="h5" component="h3" gutterBottom className={classes.leftAlign}>
              Viewer
          </Typography>
          <List component="nav" aria-label="secondary mailbox folders">
            {collabs.viewer.map((item, index) => {
              return (
                <ListItemLink key={index}  href={"https://wiki.ebrains.eu/bin/view/Collabs/" + item} target="_blank">
                  <ListItemText primary={item} />
                </ListItemLink>
              )
            })}
          </List>
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
