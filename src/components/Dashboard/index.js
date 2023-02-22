import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import DashboardDriver from './DashboardDriver'
import DashboardOperator from './DashboardOperator'
import DashboardInspector from './DashboardInspector'

export default function index() {
    const authContext = useContext(AuthContext)

    return (<>
        {authContext?.authState?.userDetails?.user_type === 'Driver' ?
            <DashboardDriver /> :
            authContext?.authState?.userDetails?.user_type === 'Operator' ?
                <DashboardOperator /> :
                authContext?.authState?.userDetails?.user_type === 'Inspector' ?
                    <DashboardInspector />
                    : null
        }
    </>

    )
}