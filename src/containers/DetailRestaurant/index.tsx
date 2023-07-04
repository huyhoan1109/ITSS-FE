import { Box, CardMedia, Typography, makeStyles } from '@material-ui/core';
import { Pagination, Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AXIOS from 'services/axios';
export const DetailRestaurant = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const classes = useStyles();
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getDetail = async () => {
      const detail = (await AXIOS.get(`restaurants/${restaurantId}`)) as any;
      console.log('detail', detail);
      setData(detail);
    };
    getDetail();
  }, [restaurantId]);
  if (!data) return <></>;
  const getDataReviewPage = () => {
    const startIndex = (page - 1) * 4;
    const endIndex = startIndex + 4;
    const reviews = [] as any;
    if (!data) return;
    data.foods.forEach((d: any) => {
      reviews.push(...d.reviews);
    });
    if (reviews.length == 0) return [];
    return reviews.slice(startIndex, endIndex);
  };
  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <CardMedia
          image={data.image}
          style={{
            width: 400,
            height: 280,
            borderRadius: 30,
          }}
        />
      </Box>
      <Box className={classes.content}>
        <Box className={classes.item}>
          <Typography>名前: </Typography>
          <Typography>{data.name}</Typography>
        </Box>
        <Box className={classes.item}>
          <Typography>住所: </Typography>
          <Typography>{data.address}</Typography>
        </Box>
        <Box className={classes.item}>
          <Typography>レーティング: </Typography>
          <Rating name="read-only" value={4} precision={0.5} readOnly />
        </Box>
        <Box className={classes.item}>
          <Typography>価格: </Typography>
          <Typography>
            {data.low_price} - {data.high_price}
          </Typography>
        </Box>
        <Box className={classes.item}>
          <Typography>開店時間: </Typography>
          <Typography>{data.open_time}</Typography>
        </Box>
        <Box className={classes.item}>
          <Typography>閉店時間: </Typography>
          <Typography>{data.close_time}</Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        width="100%"
        mt={5}
        onClick={() => {}}
      >
        <CardMedia
          image="/images/Chat_plus.png"
          style={{
            width: 52,
            height: 52,
            padding: 10,
            border: '1px solid black',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box mt={5} width={'100%'}>
        {getDataReviewPage().map((r: any, i: any) => {
          return (
            <Box
              display="flex"
              justifyContent="space-between"
              width={'100%'}
              key={i}
              style={{
                border: '1px solid black',
                padding: 20,
                margin: '20px 0px',
                borderRadius: 50,
                background: 'white',
              }}
            >
              <Box
                width="calc(100% - 140px)"
                style={{
                  display: 'flex',
                }}
              >
                <CardMedia
                  image={r.user.image || ''}
                  style={{
                    width: 120,
                    height: 100,
                    marginRight: 20,
                    borderRadius: '50%',
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-evenly"
                  width="100%"
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      style={{
                        border: '1px solid red',
                        background: 'white',
                        padding: '5px 20px',
                        marginRight: 20,
                        borderRadius: 20,
                      }}
                    >
                      <Typography>{r.user.name}</Typography>
                    </Box>
                    <Rating
                      name="read-only"
                      value={4}
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                  <Box
                    style={{
                      border: '1px solid red',
                      background: 'white',
                      padding: '5px 20px',
                      borderRadius: 20,
                      marginTop: 12,
                    }}
                  >
                    <Typography>{r.review_text}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box width={120} display="flex" justifyContent="space-between">
                {localStorage.getItem('me') &&
                  r.user.id ==
                    JSON.parse(localStorage.getItem('me') || '').id && (
                    <Box
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      <CardMedia
                        image="/images/chat.png"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  )}
                {localStorage.getItem('me') &&
                  r.user.id ==
                    JSON.parse(localStorage.getItem('me') || '').id && (
                    <Box
                      style={{
                        borderRadius: 25,
                        cursor: 'pointer',
                      }}
                      onClick={async () => {
                        const foods = localStorage.getItem('foods');
                        const currentData = foods
                          ? JSON.parse(foods).filter(
                              (d: any) => d.id == r.id,
                            )[0].reviews
                          : ([] as any);
                        let result = currentData.filter(
                          (x: any) => x.id != r.id,
                        );
                        let permisstion =
                          confirm('本人のユーザーがコメントを除きたいか');
                        if (permisstion) {
                          setData({ ...data, reviews: result.reverse() });
                          await AXIOS.delete(`reviews/${r.id}`);
                          const newFoods = await AXIOS.get('foods');
                          localStorage.setItem(
                            'foods',
                            JSON.stringify(newFoods),
                          );
                        }
                      }}
                    >
                      <CardMedia
                        image="/images/close.png"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                        }}
                      />
                    </Box>
                  )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Pagination
        count={Math.ceil(data.reviews ? data.reviews.length / 4 : 2)}
        onChange={(e, page) => {
          setPage(page);
        }}
      />
    </Box>
  );
};
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    flexDirection: 'column',
  },
  content: {
    marginTop: '40px',
    width: 700,
    background: 'white',
    borderRadius: 40,
    border: '1px solid black',
    padding: 20,
  },
  item: {
    display: 'flex',
    margin: '10px 0px',
    '&>p': {
      fontSize: 20,
    },
    '&>p:first-child': {
      marginRight: 20,
      fontWeight: 600,
      minWidth: 140,
    },
  },
}));
