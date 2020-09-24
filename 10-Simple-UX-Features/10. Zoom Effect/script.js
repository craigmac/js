// Parent div of image
const container = document.getElementById("container");
// Actual image element
const img = document.querySelector("img");

// Given "event" 'x' and 'y' values use them to transform the image
// by scaling up (i.e., zooming in to 200%) current mouse location
container.addEventListener("mousemove", (e) => {
  const x = e.clientX - e.target.offsetLeft;
  const y = e.clientY - e.target.offsetTop;

  // Using newer Js template literal strings here to eval x and y
  img.style.transformOrigin = `${x}px ${y}px`;
  img.style.transform = "scale(2)";
})

// When mouse leaves, scale everything back to original form
container.addEventListener("mouseleave", () => {
  img.style.transformOrigin = "center center";
  img.style.transform = "scale(1)";
})
