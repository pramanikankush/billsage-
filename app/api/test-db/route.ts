import { testConnection } from '@/lib/postgres'

export async function GET() {
    try {
        const isConnected = await testConnection()

        if (isConnected) {
            return Response.json({
                success: true,
                message: 'PostgreSQL connection successful!'
            })
        } else {
            return Response.json({
                success: false,
                message: 'PostgreSQL connection failed'
            }, { status: 500 })
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            error: String(error)
        }, { status: 500 })
    }
}
