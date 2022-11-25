import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link }from 'react-router-dom';
import { commerce } from '../../lib/commerce';
import FormInput from './FormInput';

const AddressForm = ({ checkoutToken ,next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisons, setShippingSubdivisons] = useState([]);
    const [shippingSubdivison, setShippingSubdivison] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    const subdivisions = Object.entries(shippingSubdivisons).map(([code, name]) => ({ id: code, label: name }));
    const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }))
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };
    const fetchSubdivisons = async (checkoutTokenId, countryCode) => {
        const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);
        setShippingSubdivisons(subdivisions);
        setShippingSubdivison(Object.keys(subdivisions)[0]);
    };
    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    };
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, []);
    useEffect(() => {
        if (shippingCountry) fetchSubdivisons(checkoutToken.id, shippingCountry);
    }, [shippingCountry]);
    useEffect(() => {
        if (shippingSubdivison) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivison);
    }, [shippingSubdivison])
    return (
        <>
            <Typography variant="h6" gutterBottom> Shipping Adress</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(( data)=>next({...data,shippingCountry,shippingSubdivison,shippingOption}))}>
                    <Grid container spacing={3}>
                        <FormInput required name='firstName' label='First name' />
                        <FormInput required name='last Name' label='last name' />
                        <FormInput required name='address1' label='Address' />
                        <FormInput required name='Email' label='Email' />
                        <FormInput required name='City' label='City' />
                        <FormInput required name='Zip' label='Zip ' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country) => (

                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Regions</InputLabel>
                            <Select value={shippingSubdivison} fullWidth onChange={(e) => setShippingSubdivison(e.target.value)}>
                                {subdivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>ShippingOptions</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingSubdivison(e.target.value)}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>{option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{display: 'flex',justifyContent:'space-between'}}>
                        <Button  component ={Link} to="/cart" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant ="contained" color="primary">Next</Button>
                    </div>
                </form>

            </FormProvider>

        </>
    );
};
export default AddressForm