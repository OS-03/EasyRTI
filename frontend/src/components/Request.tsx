import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

interface RequestProps {
    request: {
        createdAt: string;
        department: {
            logo: string;
            name: string;
            description: string;
        };
        title: string;
        description: string;
        position: string;
        salary: string;
        _id: string;
    };
}

const Request: React.FC<RequestProps> = ({ request }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime: string | number | Date) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - createdAt.getTime();
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {daysAgoFunction(request?.createdAt) === 0
                        ? 'Today'
                        : `${daysAgoFunction(request?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full" size="icon">
                    <Bookmark />
                </Button>
            </div>

            <div className="flex items-center gap-2 my-2">
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={request?.department?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className="font-medium text-lg">{request?.department?.name}</h1>
                    <p className="text-sm text-gray-500">{request?.department?.description}</p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-lg my-2">{request?.title}</h1>
                <p className="text-sm text-gray-600">{request?.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="default">
                    {request?.position} Positions
                </Badge>
                 <Badge className="text-[#7209b7] font-bold" variant="default">
                    {request?.salary} LPA
                </Badge>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Button
                    onClick={() => navigate(`/description/${request?._id}`)}
                    variant="outline"
                >
                    Details
                </Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    );
};

export default Request;