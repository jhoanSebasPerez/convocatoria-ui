import RoleGuard from "@/modules/auth/role-guard";

interface LayoutProps {
    readonly children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            {children}
        </RoleGuard>
    );
}