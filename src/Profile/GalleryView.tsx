
import React, { useEffect } from "react";
import { styled, alpha } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { decodeMetadata } from '../utils/grapeTools/utils'
// @ts-ignore
import fetch from 'node-fetch'
import { PublicKey } from '@solana/web3.js';

import {
    Pagination,
    Stack,
    Typography,
    Grid,
    Box,
    Skeleton,
    ListItemButton,
    Container,
    Tooltip,
    InputBase,
    Button,
    FormControl,
    NativeSelect,
    InputLabel
} from '@mui/material';


import { SelectChangeEvent } from '@mui/material/Select';

import SearchIcon from '@mui/icons-material/Search';

import GalleryItem from './GalleryItem';
import GalleryGroupItem from './GalleryGroupItem';
import { GRAPE_PREVIEW } from '../utils/grapeTools/constants';
import { ConstructionOutlined } from "@mui/icons-material";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '17px',
    backgroundColor: alpha(theme.palette.common.white, 0.015),
    '&:hover': {
        border: '1px solid rgba(255,255,255,0.75)',
        backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 20,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
        marginLeft: 5,
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.white, 0.25),
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
    },
  }));

export default function GalleryView(props: any){
    const [page, setPage] = React.useState(1);
    const rowsperpage = 1500;
    const mode = props?.mode || 0;
    const collectionAuthority = props?.collectionAuthority || null;
    const collectionMintList = props?.collectionMintList || null;
    const finalCollection = props?.finalCollection || null;
    const isparent = props?.isparent || false;
    const groupbysymbol = props?.groupbysymbol || null;
    //const walletCollection = props.walletCollection;
    const [foundList, setFoundList] = React.useState(collectionMintList);
    const [name, setName] = React.useState('');

    // If a gallery item is groupBySymbol > 0
    // start searching how many are grouped so we can do this as a collective :) 

    const filter = (keyword:any) => {
        //const keyword = e.target.value;
        if (keyword !== '') {
          const results = collectionMintList.filter((listitem:any) => {
            //return listitem.name.toLowerCase().startsWith(keyword.toLowerCase())
            return listitem.name.toLowerCase().includes(keyword.toLowerCase())
            // Use the toLowerCase() method to make it case-insensitive
          });

          setFoundList(results);
        } else {
          setFoundList(collectionMintList);
          // If the text field is empty, show all users
        }
    
        setName(keyword);
    };

    const handleSortChange = (type:any) => {
        //const keyword = e.target.value;
        if (type !== '') {
            sortMintList(type);
        } 
    };

    function sortMintList(type:number){
        
        if (+type === 0){
            collectionMintList.sort((a:any,b:any) => (a.price < b.price) ? 1 : -1);
            //collectionMintList.sort((a:any,b:any) => ((a.price - b.price) ));
            // now inverse the list
            Array.prototype.reverse.call(collectionMintList);
            
            setFoundList(collectionMintList);
        } else if (+type === 1){
            collectionMintList.sort((a:any,b:any) => (a.listedBlockTime < b.listedBlockTime) ? 1 : -1);
            // now inverse the list
            Array.prototype.reverse.call(collectionMintList);

            setFoundList(collectionMintList);
        } else if (+type === 2){ // by offers
            //collectionMintList.sort((a:any,b:any) => (a.offerCount > b.offerCount) ? 1 : -1);
            // now inverse the list
            //Array.prototype.reverse.call(collectionMintList);
            
            setFoundList(collectionMintList);
        } else if (+type === 3){ // by highest offers
            collectionMintList.sort((a:any,b:any) => (a.highest_offer > b.highest_offer) ? 1 : -1);
            // now inverse the list
            Array.prototype.reverse.call(collectionMintList);
            
            setFoundList(collectionMintList);
        } else if (+type === 4){ // by alphabetical
            collectionMintList.sort((a:any,b:any) => (a.name.toLowerCase().trim() > b.name.toLowerCase().trim())  ? 1 : -1 );
            setFoundList(collectionMintList);
            console.log("sorted: "+JSON.stringify(collectionMintList));
        }
    }

    return (
        <>
            {mode === 1 ?
                <>
                    {collectionMintList && collectionMintList.length > 0 && (
                        <Box
                            sx={{
                                background: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '17px',
                                p:4
                            }} 
                        > 

                            <Grid container 
                                spacing={{ xs: 1, md: 2 }} 
                                alignItems="flex-start"
                                >
                                <Grid item xs={0} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="uncontrolled-native" sx={{height:'40px',m:0,p:0}}>Sort</InputLabel>
                                        <NativeSelect
                                            defaultValue={0}
                                            inputProps={{
                                                name: 'Sorting',
                                                id: 'uncontrolled-native',
                                              }}
                                            id="filter-select"
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            sx={{borderRadius:'17px', height:'40px'}}
                                        >
                                            <option value={0}>Price Ascending</option>
                                            <option value={1} disabled>Recently listed</option>
                                            <option value={2} disabled>Most Offers</option>
                                            <option value={3} disabled>Highest Offers</option>
                                            <option value={4} disabled>Alphabetical</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Grid>    
                                
                                <Grid item xs={0} sm={10}>
                                    <Container
                                        component="form"
                                        //onSubmit={handlePublicKeySubmit}
                                        sx={{background:'none'}}
                                    >
                                        <Tooltip title='Filter Collection'>
                                            <Search
                                                sx={{height:'40px'}}
                                            >
                                                <SearchIconWrapper>
                                                    <SearchIcon />
                                                </SearchIconWrapper>
                                                <StyledInputBase
                                                    sx={{height:'40px', width:'100%'}}
                                                    placeholder='Filter Collection'
                                                    inputProps={{ 'aria-label': 'search' }}
                                                    onChange={(e) => filter(e.target.value)}
                                                    value={name}
                                                />
                                            </Search>
                                        </Tooltip>
                                    </Container>
                                </Grid>
                            </Grid>

                            <Grid container 
                                spacing={{ xs: 2, md: 3 }} 
                                alignItems="flex-start"
                                >
                            
                                <Grid item xs={0} sm={2}>
                                    {collectionAuthority && collectionAuthority?.attributes &&
                                        <>  
                                            {Object.keys(collectionAuthority.attributes).map(key => 
                                                <Button variant="outlined" sx={{m:1,color:'white',borderColor:'white',borderRadius:'17px'}}>{key}</Button>
                                            )/* {JSON.stringify(collectionAuthority.attributes[key])} */}
                                        </>
                                    }
                                </Grid>

                                <Grid item xs={12} sm={10}>
                                    <Grid container 
                                        spacing={{ xs: 2, md: 3 }} 
                                        justifyContent="center"
                                        alignItems="center">
                                        
                                        { (foundList.length > 0 ? foundList
                                        .slice((page - 1) * rowsperpage, page * rowsperpage):foundList)
                                        .map((collectionInfo: any, key: number) => {
                                            return(
                                                <Grid item xs={12} sm={12} md={4} lg={3} xl={2}>
                                                    <Box
                                                        sx={{
                                                            background: 'rgba(0, 0, 0, 0.6)',
                                                            borderRadius: '26px',
                                                            minWidth: '175px'
                                                        }} 
                                                    >
                                                        <GalleryItem collectionitem={collectionInfo} mode={mode} groupbysymbol={collectionInfo.groupBySymbol} isparent={false} listed={true} count={key} />
                                                    </Box>
                                                </Grid>
                                            )
                                        })}

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </>
            :
                <>
                {finalCollection && finalCollection.length > 0 && (
                    <Box
                        sx={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '17px',
                            p:4
                        }} 
                    > 
                        <Grid container 
                            spacing={{ xs: 2, md: 3 }} 
                            justifyContent="center"
                            alignItems="center">
                            
                            { (finalCollection.length > 0 ? finalCollection
                                .slice((page - 1) * rowsperpage, page * rowsperpage):finalCollection)
                                .map((collectionInfo: any, key: any) => {
                                    return(
                                        <>
                                            {(collectionInfo.groupBySymbol > 1) ? (
                                                <>
                                                {(collectionInfo.groupBySymbolIndex === 0) && (
                                                    <GalleryGroupItem groupCollection={finalCollection} mode={mode} symbol={collectionInfo.meta.data.symbol} isparent={true} key={key} />
                                                )}
                                                </>
                                            ):(
                                                <Grid item xs={12} sm={12} md={4} lg={3} xl={2} key={key}>
                                                    <Box
                                                        sx={{
                                                            background: 'rgba(0, 0, 0, 0.6)',
                                                            borderRadius: '26px',
                                                            minWidth: '175px'
                                                        }} 
                                                    >
                                                        <GalleryItem collectionitem={collectionInfo} mode={mode} groupbysymbol={collectionInfo.groupBySymbol} isparent={false} finalCollection={finalCollection} listed={true} count={key} />
                                                    </Box>
                                                </Grid>
                                            )}
                                        </>   
                                    )
                                }
                            )}
                        </Grid>
                        
                        { finalCollection.length > rowsperpage && 
                            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        count={(Math.ceil(finalCollection.length / rowsperpage))}
                                        page={page}
                                        //onChange={handlePageChange}
                                        defaultPage={1}
                                        color="primary"
                                        size="small"
                                        showFirstButton
                                        showLastButton
                                        //classes={{ ul: classes.paginator }}
                                        />
                                </Stack>
                            </Grid>
                        }
                    </Box>
                    
                )}
                </>
            }
        </>);
}