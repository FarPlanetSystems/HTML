/*const manifest_p = document.getElementById("text-manifest");
try {
  axios.get("http://localhost:4321/api/manifest_text").then((value) => {
    manifest_p.textContent = value["data"];
  });
} catch {
  manifest_p.textContent = "Oops! Unser Manifest ist verloren gegangen...";
}
*/

function ScrollToParagraph(position) {
  switch (position) {
    case 0:
      ScrollRouter("p0");
      break;
    case 1:
      ScrollRouter("p1");
      break;
    case 2:
      ScrollRouter("p2");
      break;
    case 3:
      ScrollRouter("p3");
      break;
    case 4:
      ScrollRouter("p4");
      break;
  }
}
function ScrollRouter(element_id) {
  document.getElementById(element_id).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}
