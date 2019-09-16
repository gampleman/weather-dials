describe("weather dial app", () => {
  beforeEach(() => {
    cy.server();
    cy.route(
      "https://eu1.locationiq.com/v1/search.php?key=4c2dc21ece247a&q=Musselburgh&format=json&addressdetails=1&limit=1",
      "fixture:location.json"
    );
    cy.route(
      "https://api.stormglass.io/v1/weather/point**",
      "fixture:weather.json"
    );
  });
  it("allow me to search for a place and render a dial", () => {
    cy.visit("/");
    cy.findByLabelText("City:").type("Musselburgh");
    cy.get("button").click();
    cy.contains('MUSSELBURGH', {timeout: 20000});
  });
});
