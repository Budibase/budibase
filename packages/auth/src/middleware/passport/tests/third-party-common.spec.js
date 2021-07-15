// Mock data

require("./utilities/test-config")

const database = require("../../../db")
const { authenticateThirdParty } = require("../third-party-common")
const { data } = require("./utilities/mock-data")

const {
  StaticDatabases,
  generateGlobalUserID
} = require("../../../db/utils")
const { newid } = require("../../../hashing")

let db

const done = jest.fn()

const getErrorMessage = () => {
  return done.mock.calls[0][2].message
}

describe("third party common", () => {
  describe("authenticateThirdParty", () => { 
    let thirdPartyUser
    
    beforeEach(() => {
      db = database.getDB(StaticDatabases.GLOBAL.name)
      thirdPartyUser = data.buildThirdPartyUser()
    })

    afterEach(async () => {
      jest.clearAllMocks()
      await db.destroy()
    })
  
    describe("validation", () => {
      const testValidation = async (message) => {
        await authenticateThirdParty(thirdPartyUser, false, done)
        expect(done.mock.calls.length).toBe(1)
        expect(getErrorMessage()).toContain(message)
      }

      it("provider fails", async () => {
        delete thirdPartyUser.provider
        testValidation("third party user provider required")
      })

      it("user id fails", async () => {
        delete thirdPartyUser.userId
        testValidation("third party user id required")
      })

      it("email fails", async () => {
        delete thirdPartyUser.email
        testValidation("third party user email required")
      })
    })

    const expectUserIsAuthenticated = () => {
      const user = done.mock.calls[0][1]
      expect(user).toBeDefined()
      expect(user._id).toBeDefined()
      expect(user._rev).toBeDefined()
      expect(user.token).toBeDefined()
      return user
    }

    const expectUserIsSynced = (user, thirdPartyUser) => {
      expect(user.provider).toBe(thirdPartyUser.provider)
      expect(user.email).toBe(thirdPartyUser.email)
      expect(user.firstName).toBe(thirdPartyUser.profile.name.givenName)
      expect(user.lastName).toBe(thirdPartyUser.profile.name.familyName)
      expect(user.thirdPartyProfile).toStrictEqual(thirdPartyUser.profile._json)
      expect(user.oauth2).toStrictEqual(thirdPartyUser.oauth2)
    }

    describe("when the user doesn't exist", () => {
      describe("when a local account is required", () => {
        it("returns an error message", async () => {
          await authenticateThirdParty(thirdPartyUser, true, done)
          expect(done.mock.calls.length).toBe(1)
          expect(getErrorMessage()).toContain("Email does not yet exist. You must set up your local budibase account first.")
        })
      })
      
      describe("when a local account isn't required", () => {
        it("creates and authenticates the user", async () => {
          await authenticateThirdParty(thirdPartyUser, false, done)
          const user = expectUserIsAuthenticated()
          expectUserIsSynced(user, thirdPartyUser)
          expect(user.roles).toStrictEqual({})
        })
      })
    })
    
    describe("when the user exists", () => {
      let dbUser
      let id
      let email

      const createUser = async () => {
        dbUser = {
          _id: id,
          email: email,
        }
        const response = await db.post(dbUser)
        dbUser._rev = response.rev
      }

      const expectUserIsUpdated = (user) => {
        // id is unchanged
        expect(user._id).toBe(id)
        // user is updated
        expect(user._rev).not.toBe(dbUser._rev)
      }

      describe("exists by email", () => {
        beforeEach(async () => {
          id = generateGlobalUserID(newid()) // random id
          email = thirdPartyUser.email //  matching email
          await createUser()
        })

        it("syncs and authenticates the user", async () => {
          await authenticateThirdParty(thirdPartyUser, true, done)
        
          const user = expectUserIsAuthenticated()
          expectUserIsSynced(user, thirdPartyUser)
          expectUserIsUpdated(user)
        })
      })

      describe("exists by id", () => {
        beforeEach(async () => {
          id = generateGlobalUserID(thirdPartyUser.userId) // matching id
          email = "test@test.com" // random email
          await createUser()
        })

        it("syncs and authenticates the user", async () => {
          await authenticateThirdParty(thirdPartyUser, true, done)
        
          const user = expectUserIsAuthenticated()
          expectUserIsSynced(user, thirdPartyUser)
          expectUserIsUpdated(user)
        })
      })
    })
  })
})

