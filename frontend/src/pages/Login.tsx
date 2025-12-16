import React from 'react';
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
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: any) => {
        try {
            await login(data);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Card className="border-t-4 border-t-blue-600">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white">Sign In</h1>
                <p className="text-slate-400 text-sm mt-1">Access your inventory dashboard</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Email" {...register('email')} error={errors.email?.message as string} />
                <Input type="password" label="Password" {...register('password')} error={errors.password?.message as string} />
                <Button type="submit" className="w-full" isLoading={isSubmitting}>Sign In</Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                New here? <Link to="/signup" className="text-blue-500 hover:underline">Create an account</Link>
            </p>
        </Card>
    );
};

export default Login;
