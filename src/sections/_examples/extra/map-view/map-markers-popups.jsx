import Map from 'react-map-gl';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import { MapPopup, MapMarker, MapControl } from 'src/components/map';

// ----------------------------------------------------------------------

function MapMarkersPopups({ data, ...other }) {
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Map
      initialViewState={{
        zoom: 2,
      }}
      {...other}
    >
      <MapControl />

      {data.map((city, index) => (
        <MapMarker
          key={`marker-${index}`}
          latitude={city.latlng[0]}
          longitude={city.latlng[1]}
          onClick={(event) => {
            event.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        />
      ))}

      {popupInfo && (
        <MapPopup
          latitude={popupInfo.latlng[0]}
          longitude={popupInfo.latlng[1]}
          onClose={() => setPopupInfo(null)}
        >
          <Box sx={{ color: 'common.white' }}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  height: '18px',
                  minWidth: '28px',
                  marginRight: '8px',
                  borderRadius: '4px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url(https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/${popupInfo.country_code.toLowerCase()}.svg)`,
                }}
              />
              <Typography variant="subtitle2">{popupInfo.name}</Typography>
            </Box>

            <Typography component="div" variant="caption">
              Timezones: {popupInfo.timezones}
            </Typography>

            <Typography component="div" variant="caption">
              Lat: {popupInfo.latlng[0]}
            </Typography>

            <Typography component="div" variant="caption">
              Long: {popupInfo.latlng[1]}
            </Typography>

            <Image
              alt={popupInfo.name}
              src={popupInfo.photoUrl}
              ratio="4/3"
              sx={{ mt: 1, borderRadius: 1 }}
            />
          </Box>
        </MapPopup>
      )}
    </Map>
  );
}

MapMarkersPopups.propTypes = {
  data: PropTypes.array,
};

export default memo(MapMarkersPopups);
