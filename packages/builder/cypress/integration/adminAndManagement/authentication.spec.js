import filterTests from "../../support/filterTests"
// const interact = require("../support/interact")

filterTests(["smoke", "all"], () => {
  context("Auth Configuration", () => {
    before(() => {
      cy.login()
    })

    after(() => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/manage/auth")
      })

      cy.get("[data-cy=new-scope-input]").clear()

      cy.get("div.content").scrollTo("bottom")
      cy.get("[data-cy=oidc-active]").click()

      cy.get("[data-cy=oidc-active]").should('not.be.checked')

      cy.intercept("POST", "/api/global/configs").as("updateAuth")
      cy.get("button[data-cy=oidc-save]").contains("Save").click({force: true})
      cy.wait("@updateAuth")
      cy.get("@updateAuth").its("response.statusCode").should("eq", 200)

      cy.get(".spectrum-Toast-content")
        .contains("Settings saved")
        .should("be.visible")
    })

    it("Should allow updating of the OIDC config", () => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/manage/auth")
      })
      cy.get("div.content").scrollTo("bottom")
      cy.get(".spectrum-Toast .spectrum-ClearButton").click()

      cy.get("input[data-cy=configUrl]").type("http://budi-auth.com/v2")
      cy.get("input[data-cy=clientID]").type("34ac6a13-f24a-4b52-c70d-fa544ffd11b2")
      cy.get("input[data-cy=clientSecret]").type("12A8Q~4nS_DWhOOJ2vWIRsNyDVsdtXPD.Zxa9df_")

      cy.get("button[data-cy=oidc-save]").should("not.be.disabled");

      cy.intercept("POST", "/api/global/configs").as("updateAuth")
      cy.get("button[data-cy=oidc-save]").contains("Save").click({force: true})
      cy.wait("@updateAuth")
      cy.get("@updateAuth").its("response.statusCode").should("eq", 200)

      cy.get(".spectrum-Toast-content")
        .contains("Settings saved")
        .should("be.visible")
    })

    it("Should display default scopes in advanced config.", () => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/manage/auth")
      })
      cy.get("div.content").scrollTo("bottom")

      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get(".spectrum-Tags-item").contains("openid")
      cy.get(".spectrum-Tags-item").contains("openid").find(".spectrum-ClearButton").should("not.exist")

      cy.get(".spectrum-Tags-item").contains("offline_access")
      cy.get(".spectrum-Tags-item").contains("email")
      cy.get(".spectrum-Tags-item").contains("profile")
    })

    it("Add a new scopes", () => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/manage/auth")
      })
      cy.get("div.content").scrollTo("bottom")

      cy.get("[data-cy=new-scope-input]").type("Sample{enter}")
      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 5)
      cy.get(".spectrum-Tags-item").contains("Sample")

      cy.get(".auth-form input.spectrum-Textfield-input").type("Another ")
      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 6)
      cy.get(".spectrum-Tags-item").contains("Another")
      
      cy.get("button[data-cy=oidc-save]").should("not.be.disabled");

      cy.intercept("POST", "/api/global/configs").as("updateAuth")
      cy.get("button[data-cy=oidc-save]").contains("Save").click({force: true})
      cy.wait("@updateAuth")
      cy.get("@updateAuth").its("response.statusCode").should("eq", 200)

      cy.reload()

      cy.get("div.content").scrollTo("bottom")

      cy.get(".spectrum-Tags-item").contains("openid")
      cy.get(".spectrum-Tags-item").contains("offline_access")
      cy.get(".spectrum-Tags-item").contains("email")
      cy.get(".spectrum-Tags-item").contains("profile")
      cy.get(".spectrum-Tags-item").contains("Sample")
      cy.get(".spectrum-Tags-item").contains("Another")
    })

    it("Should allow the removal of auth scopes", () => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/manage/auth")
      })
      cy.get("div.content").scrollTo("bottom")

      cy.get(".spectrum-Tags-item").contains("offline_access").parent().find(".spectrum-ClearButton").click()
      cy.get(".spectrum-Tags-item").contains("profile").parent().find(".spectrum-ClearButton").click()

      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get(".spectrum-Tags-item").contains("offline_access").should("not.exist")
      cy.get(".spectrum-Tags-item").contains("profile").should("not.exist")

      cy.get("button[data-cy=oidc-save]").should("not.be.disabled");

      cy.intercept("POST", "/api/global/configs").as("updateAuth")
      cy.get("button[data-cy=oidc-save]").contains("Save").click({force: true})
      cy.wait("@updateAuth")
      cy.get("@updateAuth").its("response.statusCode").should("eq", 200)

      cy.get(".spectrum-Toast-content")
        .contains("Settings saved")
        .should("be.visible")

      cy.reload()

      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get(".spectrum-Tags-item").contains("offline_access").should("not.exist")
      cy.get(".spectrum-Tags-item").contains("profile").should("not.exist")
    })

    it("Should allow auth scopes to be reset to the core defaults.", () => {
      cy.get(".spectrum-SideNav li").contains("Auth").click()

      cy.get("div.content").scrollTo("bottom")

      cy.get("[data-cy=restore-oidc-default-scopes]").click({force: true})

      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get(".spectrum-Tags-item").contains("openid")
      cy.get(".spectrum-Tags-item").contains("offline_access")
      cy.get(".spectrum-Tags-item").contains("email")
      cy.get(".spectrum-Tags-item").contains("profile")
    })

    it("Should not allow invalid characters in the auth scopes", () => {
      cy.get("[data-cy=new-scope-input]").type("thisIsInvalid\\{enter}")
      cy.get(".spectrum-Form-itemField .error").contains("Auth scopes cannot contain spaces, double quotes or backslashes")
      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get("[data-cy=new-scope-input]").clear()

      cy.get("[data-cy=new-scope-input]").type("alsoInvalid\"{enter}")
      cy.get(".spectrum-Form-itemField .error").contains("Auth scopes cannot contain spaces, double quotes or backslashes")
      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)

      cy.get("[data-cy=new-scope-input]").clear()
    })

    it("Should not allow duplicate auth scopes", () => {
      cy.get("[data-cy=new-scope-input]").type("offline_access{enter}")
      cy.get(".spectrum-Form-itemField .error").contains("Auth scope already exists")
      cy.get(".spectrum-Tags").find(".spectrum-Tags-item").its("length").should("eq", 4)
    })

  })
})