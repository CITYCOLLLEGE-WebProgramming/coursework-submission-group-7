import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./NewPostPage.css";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!value.trim()) {
      setError("Submit Failed: Description cannot be empty");
      alert("Submit Failed: Description cannot be empty");
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    if (images.length > 3) {
      setError("Submit Failed: You cannot upload more than 3 images");
      alert("Submit Failed: You cannot upload more than 3 images");
      setImages([]);
      return;
    }

    if (images.length === 0) {
      setError("Submit Failed: Upload an image");
      alert("Submit Failed: Upload an image");
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          hospital: parseInt(inputs.hospital),
        },
      });

      alert("New post created successfully!");
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.message);
      alert("Submit Failed: " + err.message);
    }
  };

  const handleSetImages = (newImages) => {
    if (newImages.length > 3) {
      setError("You can only upload up to 3 images");
      alert("You can only upload up to 3 images");
      setImages([]);
      return;
    }
    setImages(newImages);
  };

  return (
    <Box className="new-post-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Post
      </Typography>
      <div className="new-post-scroll-container">
        <form ref={formRef} onSubmit={handleSubmit} className="new-post-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="title"
                name="title"
                label="Title"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="address"
                name="address"
                label="Address"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="city"
                name="city"
                label="City"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bedroom"
                name="bedroom"
                label="Bedroom Number"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bathroom"
                name="bathroom"
                label="Bathroom Number"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="latitude"
                name="latitude"
                label="Latitude"
                variant="outlined"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="longitude"
                name="longitude"
                label="Longitude"
                variant="outlined"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  label="Type"
                >
                  <MenuItem value="rent">Rent</MenuItem>
                  <MenuItem value="buy">Buy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="property-label">Property</InputLabel>
                <Select
                  labelId="property-label"
                  id="property"
                  name="property"
                  label="Property"
                >
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="size"
                name="size"
                label="Total Size (sqft)"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 25 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="school"
                name="school"
                label="School"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bus"
                name="bus"
                label="Bus"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="hospital"
                name="hospital"
                label="Hospital"
                variant="outlined"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </Grid>
            <Grid item xs={12}>
              {images.map((image, index) => (
                <img
                  src={image}
                  key={index}
                  alt={`Uploaded ${index}`}
                  className="uploaded-image"
                />
              ))}
              <UploadWidget
                uwConfig={{
                  multiple: true,
                  cloudName: "do0bruuzy",
                  uploadPreset: "realestate",
                  maxImageFileSize: 8500000,
                  folder: "posts",
                }}
                setState={handleSetImages}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Box>
  );
}

export default NewPostPage;
