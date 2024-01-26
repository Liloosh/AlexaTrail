import { json, useLoaderData } from "react-router-dom";
import RefsTable from "../components/CreationPageComponents/CreationArea/RefsTable";
import DemoPageOnCreationPage from "../components/CreationPageComponents/DemoArea/DemoPageOnCreationPage";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, IconButton } from "@mui/material";
import { QRCode } from "react-qrcode";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { type } from "@testing-library/user-event/dist/type";

function CreationPage() {
  const loaderData = useLoaderData();
  const [refsList, setRefsList] = useState(loaderData.refsList);
  const [refsGroupName, setRefsGroupName] = useState(
    loaderData.refsGroupName.refGroupName
  );
  const [image, setImage] = useState(loaderData.image);

  useEffect(() => {
    setRefsList(loaderData.refsList);
    setRefsGroupName(loaderData.refsGroupName.refGroupName);
    setImage(loaderData.image);
  }, [loaderData.refsList]);

  const downloadQrCode = async () => {
    const canvas = await html2canvas(
      document.getElementById("qrcode-container")
    );
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qrcode1.png";
    link.click();
  };

  const clipboardHandle = () => {
    navigator.clipboard.writeText(
      "http://localhost:3000/personalPage/" + refsGroupName
    );
  };

  return (
    <div className="min-h-screen bg-[#d4d4b5] w-full">
      <div className="flex max-tablet:flex-col  justify-center items-center py-8 max-tablet:w-[27rem] max-tablet:mx-auto">
        <Button
          onClick={downloadQrCode}
          variant="outlined"
          color="primary"
          className=" rounded-none rounded-l-md max-tablet:w-full max-tablet:rounded-t-xl max-tablet:rounded-b-none"
        >
          Generate and download QR-Code
        </Button>
        <div className="max-tablet:flex max-tablet:w-full">
          <Button
            target="blank"  
            href={`http://localhost:3000/personalPage/${refsGroupName}`}
            className=" rounded-none max-tablet:w-full max-tablet:rounded-bl-xl"
            variant="outlined"
          >
            Go to page
          </Button>
          <Button
            onClick={clipboardHandle}
            variant="outlined"
            className=" rounded-none rounded-r-md max-tablet:rounded-br-xl max-tablet:rounded-t-none"
          >
            <ContentCopyIcon fontSize="medium" color="primary" />
          </Button>
        </div>
      </div>
      <div className=" h-fit mx-auto w-fit mb-6" id="qrcode-container">
        <QRCode value={"http://localhost:3000/personalPage/" + refsGroupName} />
      </div>
      <div className="flex flex-wrap w-[86rem]   mx-auto  max-tablet:gap-6 max-tablet:flex-col max-tablet:w-fit">
        <RefsTable refsList={refsList} />
        <DemoPageOnCreationPage image={image} refsList={refsList} />
      </div>
    </div>
  );
}

export default CreationPage;

export async function loader({ params }) {
  const refsId = params.refsPageId;

  const response1 = await fetch("https://localhost:7189/api/Ref/" + refsId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  const response2 = await fetch(
    "https://localhost:7189/api/RefsGroup/refsGroupName/" + refsId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  const response3 = await fetch(
    "https://localhost:7189/api/RefsGroup/getImage/" + refsId,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  const refsList = await response1.json();
  const refsGroupName = await response2.json();
  const image = await response3.json();
  return { refsList, refsGroupName, image };
}

export async function action({ request, params }) {
  const refsGroupId = params.refsPageId;
  const formData = await request.formData();

  if (request.method === "POST") {
    if (formData.get("text1") !== null) {
      console.log("create-double");
      const response = await fetch(
        "https://localhost:7189/api/Ref/" + refsGroupId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify([
            {
              text: formData.get("text1"),
              url: formData.get("url1"),
              type: formData.get("type1"),
              order: formData.get("order"),
            },
            {
              text: formData.get("text2"),
              url: formData.get("url2"),
              type: formData.get("type2"),
              order: formData.get("order"),
            },
          ]),
        }
      );
      const resData = response.json();
      return null;
    } else if (formData.get("image") !== null) {
      const response = await fetch(
        "https://localhost:7189/api/RefsGroup/setImage/" + refsGroupId,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData.get("image"),
        }
      );

      console.log(true);
      return null;
    }
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + refsGroupId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify([
          {
            text: formData.get("text"),
            url: formData.get("url"),
            type: formData.get("type"),
            order: formData.get("order"),
          },
        ]),
      }
    );
    const resData = response.json();
    console.log(resData);
    return null;
  } else if (request.method === "DELETE") {
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + refsGroupId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(formData.get("refId")),
      }
    );
    const resData = response.json();
    return null;
  } else if (request.method === "PATCH") {
    console.log("hey");
    if (formData.get("items")) {
      console.log(formData.get("items"));
      const response = await fetch(
        "https://localhost:7189/api/Ref/" + formData.get("refGroupId"),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData.get("items"),
        }
      );
      return null;
    }
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + formData.get("refGroupId"),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify([
          {
            id: formData.get("refId"),
            type: formData.get("Type"),
            url: formData.get("url"),
            text: formData.get("text"),
            order: formData.get("order"),
          },
        ]),
      }
    );
    return null;
  } else if (request.method === "PUT") {
    console.log(formData.get("list"));
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + refsGroupId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData.get("list"),
      }
    );

    return null;
  }
}
