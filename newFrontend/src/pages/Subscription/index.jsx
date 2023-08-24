import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  HiOutlineBriefcase,
  HiOutlineCheck,
  HiOutlineHome,
  HiAcademicCap,
} from "react-icons/hi";
import { RiBuilding2Fill, RiBuildingLine } from "react-icons/ri";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QBButton from "@/Components/QBButton";

import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();
  const [creditPlanMethod, setCreditPlanMethod] = useState("monthly");

  var settings = {
    dots: true,
    speed: 500,
    dotsClass: "slick-dots template-dots",
    slidesToShow: 6,
    infinite: false,
    responsive: [
      {
        breakpoint: 2300,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1700, // apply below 1700px
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1440, // apply below 1440px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200, // apply below 1200px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900, // apply below 900px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <h1 className="mt-4 text-center text-3xl font-bold text-white">
        Credit Subscription Plans
      </h1>
      <div className="my-8 flex w-full justify-center">
        <div className="flex rounded">
          <QBButton
            size="sm"
            className="group flex items-center justify-center gap-2 rounded-none"
            color={creditPlanMethod === "monthly" ? "cyan" : "blue-gray"}
            onClick={() => setCreditPlanMethod("monthly")}
          >
            <div className="flex h-5 w-5 items-center justify-center border">
              <HiOutlineCheck
                className={`h-5 w-5 opacity-${
                  creditPlanMethod === "monthly" ? "100" : "0"
                } group-hover:opacity-100`}
              />
            </div>
            <span>Monthly Plan</span>
          </QBButton>
          <QBButton
            size="sm"
            className="group flex items-center justify-center gap-2 rounded-none"
            color={creditPlanMethod === "yearly" ? "cyan" : "blue-gray"}
            onClick={() => setCreditPlanMethod("yearly")}
          >
            <div className="flex h-5 w-5 items-center justify-center border">
              <HiOutlineCheck
                className={`h-5 w-5 opacity-${
                  creditPlanMethod === "yearly" ? "100" : "0"
                } group-hover:opacity-100`}
              />
            </div>
            <span>
              Yearly Plan<span className="text-xs text-yellow-700">(-20%)</span>
            </span>
          </QBButton>
        </div>
      </div>
      <Slider {...settings} className="m-auto w-full">
        <div className="px-4">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-[10px] opacity-90"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 py-6 px-2 text-center"
            >
              <Typography
                variant="h5"
                color="white"
                className="flex items-center justify-center gap-2 font-normal"
              >
                <HiOutlineHome className="h-8 w-8" />
                <span>Free</span>
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2">
              <div className="h-[100px]">
                <p className="text-center text-sm">
                  Free forever, no credit card
                </p>
              </div>
              <div className="flex w-full justify-center pb-4">
                <p>
                  <span className="text-xl font-bold">$0</span>{" "}
                  <span className="text-xs">per month</span>
                </p>
              </div>
            </CardBody>
            <CardFooter className="mt-12 p-0">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-[10px] opacity-90"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 py-6 px-2 text-center"
            >
              <Typography
                variant="h5"
                color="white"
                className="flex items-center justify-center gap-2 font-normal"
              >
                <HiOutlineBriefcase className="h-8 w-8" />
                <span>Basic</span>
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2">
              <div className="h-[100px]">
                <p className="text-center text-sm">
                  Basic level - supporting intraday data and up to 10 years of
                  historical data.
                </p>
              </div>
              <div className="flex w-full justify-center pb-4">
                <p>
                  <span className="text-xl font-bold">
                    <span>$9</span>
                    <sup className="text-sm">.99</sup>
                  </span>{" "}
                  <span className="text-xs">per month</span>
                </p>
              </div>
            </CardBody>
            <CardFooter className="mt-12 p-0">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-[10px] opacity-90"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 py-6 px-2 text-center"
            >
              <Typography
                variant="h5"
                color="white"
                className="flex items-center justify-center gap-2 font-normal"
              >
                <HiAcademicCap className="h-8 w-8" />
                <span>Professional</span>
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2">
              <div className="h-[100px]">
                <p className="text-center text-sm">
                  Basic level - supporting intraday data and up to 10 years of
                  historical data.
                </p>
              </div>
              <div className="flex w-full justify-center pb-4">
                <p>
                  <span className="text-xl font-bold">
                    <span>$9</span>
                    <sup className="text-sm">.99</sup>
                  </span>{" "}
                  <span className="text-xs">per month</span>
                </p>
              </div>
            </CardBody>
            <CardFooter className="mt-12 p-0">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-[10px] opacity-90"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 py-6 px-2 text-center"
            >
              <Typography
                variant="h5"
                color="white"
                className="flex items-center justify-center gap-2 font-normal"
              >
                <RiBuilding2Fill className="h-8 w-8" />
                <span>Business</span>
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2">
              <div className="h-[100px]">
                <p className="text-center text-sm">
                  Business level - all the tools you will ever need, for up to
                  500,000 monthly requests.
                </p>
              </div>
              <div className="flex w-full justify-center pb-4">
                <p>
                  <span className="text-xl font-bold">
                    <span>$149</span>
                    <sup className="text-sm">.99</sup>
                  </span>{" "}
                  <span className="text-xs">per month</span>
                </p>
              </div>
            </CardBody>
            <CardFooter className="mt-12 p-0">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-[10px] opacity-90"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 py-6 px-2 text-center"
            >
              <Typography
                variant="h5"
                color="white"
                className="flex items-center justify-center gap-2 font-normal"
              >
                <RiBuildingLine className="h-8 w-8" />
                <span>Enterprise</span>
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2">
              <div className="h-[100px]">
                <p className="text-center text-sm">
                  Looking for more? Contact us for a quote.
                </p>
              </div>
              <div className="w-full text-center">
                <p>
                  <span className="text-xl font-bold">Custom Pricing</span>{" "}
                </p>
                <p className="text-xs">Tailored to your needs.</p>
              </div>
            </CardBody>
            <CardFooter className="mt-12 p-0">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Slider>
      <h1 className="mt-10 flex flex-col items-center justify-center text-center text-3xl font-bold text-white">
        Recharge your credits
        <ul className="juistfy-center flex flex-col items-center">
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon strokeWidth={4} className="h-2 w-2" />
            </span>
            <Typography className="font-normal text-gray-400">
              Use credits to run apps
            </Typography>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon strokeWidth={4} className="h-2 w-2" />
            </span>
            <Typography className="font-normal text-gray-400">
              Sponsor App credits&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Typography>
          </li>
          <li className="flex items-center gap-4">
            <Typography className="font-normal text-gray-400">
              (Remaining: 100, Used: 0)
            </Typography>
          </li>
        </ul>
      </h1>
      <div className="m-auto mt-8 grid max-w-[700px] grid-cols-1 gap-6 laptop:grid-cols-3">
        <div className="col-span-1">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-2"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 px-2 pt-4 text-center"
            >
              <Typography
                variant="h1"
                color="white"
                className="flex justify-center gap-1 font-normal"
              >
                100
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal uppercase"
              >
                Credits
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2 text-center">
              <Typography
                variant="h4"
                color="white"
                className="mt-6 flex justify-center gap-1 font-normal"
              >
                $15
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal text-gray-200"
              >
                Launch Promo Discount
              </Typography>
            </CardBody>
            <CardFooter className="mt-8 p-0 px-2">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-1">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-2"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 px-2 pt-4 text-center"
            >
              <Typography
                variant="h1"
                color="white"
                className="flex justify-center gap-1 font-normal"
              >
                500
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal uppercase"
              >
                Credits
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2 text-center">
              <Typography
                variant="h4"
                color="white"
                className="mt-6 flex justify-center gap-1 font-normal"
              >
                $60
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal text-gray-200"
              >
                Launch Promo Discount
              </Typography>
            </CardBody>
            <CardFooter className="mt-8 p-0 px-2">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-1">
          <Card
            color="cyan"
            variant="gradient"
            className="m-auto w-full rounded p-2"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 rounded-none border-b border-white/10 px-2 pt-4 text-center"
            >
              <Typography
                variant="h1"
                color="white"
                className="flex justify-center gap-1 font-normal"
              >
                1000
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal uppercase"
              >
                Credits
              </Typography>
            </CardHeader>
            <CardBody className="p-0 px-2 text-center">
              <Typography
                variant="h4"
                color="white"
                className="mt-6 flex justify-center gap-1 font-normal"
              >
                $100
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="font-normal text-gray-200"
              >
                Launch Promo Discount
              </Typography>
            </CardBody>
            <CardFooter className="mt-8 p-0 px-2">
              <Button
                size="sm"
                color="white"
                className="rounded text-blue-500 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                ripple={false}
                fullWidth={true}
              >
                Buy
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="m-auto mt-24 grid w-full max-w-[800px] grid-cols-5 gap-8 laptop:gap-12">
        <div className="col-span-5 flex justify-center laptop:col-span-1">
          <img src="img/contactus.svg" className="w-full max-w-[120px]" />
        </div>
        <div className="col-span-5 font-bold laptop:col-span-4">
          <h1 className="text-3xl text-white">
            We know it can be tough to decide - that's why we're here to help
            you find the right plan with ease.
          </h1>
          <QBButton
            color="cyan"
            className="mt-4 rounded"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </QBButton>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
