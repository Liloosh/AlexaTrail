import { json, useLoaderData } from "react-router-dom";
import RefsTable from "../components/CreationPageComponents/CreationArea/RefsTable";
import DemoPageOnCreationPage from "../components/CreationPageComponents/DemoArea/DemoPageOnCreationPage";

function CreationPage() {
  const loaderData = useLoaderData();

  return (
    <div>
      <RefsTable refsList={loaderData} />
      <DemoPageOnCreationPage refsList={loaderData} />
    </div>
  );
}

export default CreationPage;

export async function loader({ params }) {
  const refsId = params.refsPageId;

  const response = await fetch("https://localhost:7189/api/Ref/" + refsId, {
    method: "GET",
  });

  const resData = await response.json();
  return resData;
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
          headers: { "Content-Type": "application/json" },
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
    }
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + refsGroupId,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.get("refId")),
      }
    );
    const resData = response.json();
    return null;
  } else if (request.method === "PATCH") {
    if (formData.get("items")) {
      console.log(formData.get("items"));
      const response = await fetch(
        "https://localhost:7189/api/Ref/" + formData.get("refGroupId"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: formData.get("items"),
        }
      );
      return null;
    }
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + formData.get("refGroupId"),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: formData.get("list"),
      }
    );

    return null;
  }
}
