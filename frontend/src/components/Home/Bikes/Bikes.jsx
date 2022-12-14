import React, { useState, useEffect } from "react";
import "antd/dist/antd";
import "../../../index.css";
import Pagination from "react-js-pagination";
import {
  Layout,
  Input,
  Space,
  DatePicker,
  Button,
  Select,
  Modal,
  Form,
} from "antd";
import BikeCard from "./BikeCard";
import { createTheme, Grid } from "@mui/material";
import {
  addNewBike,
  getBikes,
  getFilteredBikes,
} from "../../../Service/BikeService";
import { useDispatch, useSelector } from "react-redux";
import { AddBikeSchema } from "../../../JoiSchema/Schema";
import { useAlert } from "react-alert";
import Loader from "../../Loader/Loader";
import moment from "moment";
const { Option } = Select;

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 1030,
      sm: 1200,
      md: 1536,
      lg: 1536,
      xl: 1115,
    },
  },
});

const Bike = () => {
  const {
    isManager,
    filterMode,
    totalBikes,
    isDateFilterAdded,
    filterName,
    filterColor,
    filterLocation,
    filterRating,
    fromDate,
    toDate,
  } = useSelector((state) => state.bikeReservation);

  const dispatch = useDispatch();
  const [rating, setRating] = useState(filterRating);
  const [name, setName] = useState(filterName);
  const [color, setColor] = useState(filterColor);
  const [location, setLocation] = useState(filterLocation);
  const [duration, setDuration] = useState([fromDate, toDate]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addBikeName, setAddBikeName] = useState("");
  const [addBikeColor, setAddBikeColor] = useState("");
  const [addBikeLocation, setAddBikeLocation] = useState("");
  const [addIsAvailable, setAddIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const [form] = Form.useForm();

  const handleSubmitAddBike = async () => {
    try {
      await AddBikeSchema.validateAsync({
        name: addBikeName,
        color: addBikeColor,
        location: addBikeLocation,
        isAvailable: addIsAvailable,
      });
      setIsModalVisible(false);
      const res = await addNewBike({
        addBikeName,
        addBikeColor,
        addBikeLocation,
        addIsAvailable,
      });
      if (res.success) {
        alert.show("Bike Added Succesfully");
        await getAllBikes();
        setAddBikeName("");
        setAddBikeColor("");
        setAddBikeLocation("");
        setAddIsAvailable(false);
      } else {
        alert.show("Some Error Occured");
      }
    } catch (error) {
      // console.log(error);
      alert.show(error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getAllBikes = async () => {
    try {
      const data = await getBikes({
        page: currentPage,
      });
      dispatch({ type: "totalBikes", payload: data.totalBikes });
      setBikes(data.bikes);
    } catch (error) {
      alert.show(error.message);
    }
  };

  const handleAddBike = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
    if (filterMode) {
      handleFilterSubmit();
    } else {
      getAllBikes();
    }
  }, [currentPage, filterMode, isDateFilterAdded]);

  const handleChange = (date, dateString) => {
    // console.log(date, dateString);
    setDuration(dateString);
  };

  const handleFilterSubmit = async () => {
    // console.log(name, location, color, rating, "DURATION", duration);
    try {
      dispatch({ type: "filterMode", payload: true });
      dispatch({ type: "toDate", payload: duration[1] });
      dispatch({ type: "fromDate", payload: duration[0] });
      dispatch({ type: "filterName", payload: name });
      dispatch({ type: "filterColor", payload: color });
      dispatch({ type: "filterLocation", payload: location });
      dispatch({ type: "filterRating", payload: rating });
      const data = await getFilteredBikes({
        name: name.trim(),
        location: location.trim(),
        color: color.trim(),
        rating,
        fromDate: duration[0],
        toDate: duration[1],
        page: currentPage,
      });
      dispatch({ type: "totalBikes", payload: data.totalBikes });
      if (data.totalBikes === 0) {
        alert.show("No bikes Found For Given Filter");
      }
      setBikes(data.bikes);
      // console.log(duration);
      if (duration.length === 0) {
        dispatch({ type: "isDateFilterAdded", payload: false });
      } else if (duration[0] === "0" && duration[1] === "0") {
        dispatch({ type: "isDateFilterAdded", payload: false });
      } else if (duration[0] !== "" && duration[1] !== "") {
        dispatch({ type: "isDateFilterAdded", payload: true });
      } else {
        dispatch({ type: "isDateFilterAdded", payload: false });
      }
    } catch (error) {
      alert.show(error.message);
    }
  };

  const handleRemoveFilter = () => {
    dispatch({ type: "toDate", payload: "0" });
    dispatch({ type: "fromDate", payload: "0" });
    dispatch({ type: "filterMode", payload: false });
    dispatch({ type: "isDateFilterAdded", payload: false });
    dispatch({ type: "filterName", payload: "" });
    dispatch({ type: "filterColor", payload: "" });
    dispatch({ type: "filterLocation", payload: "" });
    dispatch({ type: "filterRating", payload: "0" });
    setDuration(["", ""]);
    setName("");
    setColor("");
    setLocation("");
    setRating("0");
    // console.log(duration);
    form.resetFields();
  };

  return (
    <div className="bike__homapage">
      {loading ? (
        <Loader />
      ) : (
        <div className="bike__homepage__container">
          <div className="bike__filter__container">
            <Layout>
              <Sider
                // theme={theme1}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {}}
                onCollapse={(collapsed, type) => {}}
                style={{
                  padding: 24,
                  height: "90vh",
                }}
              >
                <div
                  style={{
                    padding: 24,
                    minWidth: 400,
                  }}
                >
                  <Space>
                    Name :{" "}
                    <Input
                      placeholder="Bike Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Space>
                  <br />
                  <br />
                  <Space>
                    Color :{" "}
                    <Input
                      placeholder="Bike Color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </Space>

                  <br />
                  <br />
                  <Space>
                    Location :{" "}
                    <Input
                      placeholder="Bike Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Space>

                  <br />
                  <br />
                  <Space wrap>
                    Rating :
                    <Input.Group compact>
                      <Select defaultValue={rating} onChange={setRating}>
                        <Option value="0">0</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                      </Select>
                    </Input.Group>
                  </Space>
                  <br />
                  <br />
                  <Space direction="vertical" size="large">
                    <Form form={form}>
                      <Form.Item name="date" label="Duration">
                        {isDateFilterAdded ? (
                          <RangePicker
                            showTime
                            defaultValue={[moment(fromDate), moment(toDate)]}
                            onChange={handleChange}
                            disabledDate={(current) => {
                              return moment().add(-1, "days") >= current;
                            }}
                          />
                        ) : (
                          <RangePicker
                            showTime
                            onChange={handleChange}
                            disabledDate={(current) => {
                              return moment().add(-1, "days") >= current;
                            }}
                          />
                        )}
                      </Form.Item>
                    </Form>
                  </Space>
                  <br />
                  <br />
                  <Space size="large">
                    <Button
                      onClick={() => {
                        setCurrentPage(1);
                        handleFilterSubmit();
                      }}
                      type="primary"
                    >
                      Apply Filter
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentPage(1);
                        handleRemoveFilter();
                      }}
                    >
                      Remove Filter
                    </Button>
                  </Space>
                </div>
              </Sider>
              <Layout>
                <Content
                  className="site-layout-background"
                  style={{
                    margin: "50px 25px",
                    padding: 25,
                  }}
                >
                  <div className="bikes__container">
                    {isManager && (
                      <Button
                        style={{
                          backgroundColor: "#95de64",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={handleAddBike}
                      >
                        Add a New bike
                      </Button>
                    )}
                    <div className="bike__cards">
                      <Grid container spacing={3} theme={theme}>
                        {bikes &&
                          bikes.map((bike) => (
                            <Grid item xs={12} key={bike.id}>
                              <BikeCard
                                bike={bike}
                                key={bike.id}
                                duration={duration}
                                getAllBikes={handleFilterSubmit}
                                setLoading={setLoading}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    </div>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </div>
          <div className="bike__main__card__container">
            <Modal
              title="Add New Bike"
              visible={isModalVisible}
              onOk={handleSubmitAddBike}
              onCancel={handleCancel}
              okText="Add Bike"
            >
              <div>
                <Space>
                  Name:{" "}
                  <Input
                    placeholder="Enter Bike Name"
                    value={addBikeName}
                    onChange={(e) => setAddBikeName(e.target.value)}
                  />
                </Space>
                <br />
                <br />
                <Space>
                  Color:{" "}
                  <Input
                    placeholder="Enter Bike Color"
                    value={addBikeColor}
                    onChange={(e) => setAddBikeColor(e.target.value)}
                  />
                </Space>
                <br />
                <br />
                <Space>
                  Location:{" "}
                  <Input
                    placeholder="Enter Bike Location"
                    value={addBikeLocation}
                    onChange={(e) => setAddBikeLocation(e.target.value)}
                  />
                </Space>
                <br />
                <br />
                <Space wrap>
                  Available :
                  <Input.Group compact>
                    <Select
                      defaultValue={addIsAvailable}
                      onChange={setAddIsAvailable}
                    >
                      <Option value={false}>No</Option>
                      <Option value={true}>Yes</Option>
                    </Select>
                  </Input.Group>
                </Space>
              </div>
            </Modal>
          </div>

          <div className="pagination__box">
            <div className="pagination__box__container">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={5}
                totalItemsCount={Number(totalBikes)}
                onChange={(e) => setCurrentPage(e)}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                // activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bike;
