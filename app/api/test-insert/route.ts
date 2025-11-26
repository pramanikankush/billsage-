import { db } from '@/lib/db-server'

export async function GET() {
    try {
        // Create a test user
        const testUser = await db.createUser({
            id: `test_${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            name: 'Test User',
            role: 'user',
            organizationId: 'test_org',
            createdAt: new Date().toISOString()
        })

        // Retrieve the user to confirm it was saved
        const retrievedUser = await db.getUser(testUser.id)

        return Response.json({
            success: true,
            message: 'Test user created and retrieved successfully!',
            createdUser: testUser,
            retrievedUser: retrievedUser,
            instructions: 'Check pgAdmin: billsage → Schemas → public → Tables → users → View/Edit Data → All Rows'
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to create test user',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
