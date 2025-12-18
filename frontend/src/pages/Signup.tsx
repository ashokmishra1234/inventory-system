
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6, 'Min 6 characters'),
    role: z.enum(['viewer', 'manager', 'admin'])
});

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { role: 'viewer' }
    });

    const onSubmit = async (data: any) => {
        try {
            await signup(data);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <Card className="border-t-4 border-t-blue-600">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                <p className="text-slate-400 text-sm mt-1">Join the inventory system</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Full Name" {...register('name')} error={errors.name?.message as string} />
                <Input label="Email" {...register('email')} error={errors.email?.message as string} />
                <Input type="password" label="Password" {...register('password')} error={errors.password?.message as string} />
                
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Role</label>
                    <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register('role')}
                    >
                        <option value="viewer">Viewer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>Sign Up</Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
            </p>
        </Card>
    );
};

export default Signup;
