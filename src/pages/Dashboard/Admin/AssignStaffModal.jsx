import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const AssignStaffModal = ({ issueId, staffList, onClose, refetchIssues }) => {
    const [selectedStaff, setSelectedStaff] = useState('');
    const axiosSecure = useAxiosSecure();

  
    const assignMutation = useMutation({
        mutationFn: (staffInfo) => {
            
            return axiosSecure.patch(`/dashboard/admin/issues/${issueId}/assign`, staffInfo);
        },
        onSuccess: (res) => {
            if (res.data.modifiedCount > 0) {
                 Swal.fire('Assigned!', 'Staff member assigned successfully.', 'success');
                 refetchIssues();
                 onClose();
            }
        },
        onError: () => {
            Swal.fire('Error', 'Failed to assign staff.', 'error');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStaff) {
            Swal.fire('Error', 'Please select a staff member.', 'warning');
            return;
        }

        const staffMember = staffList.find(s => s.email === selectedStaff);
        if (staffMember) {
            const staffInfo = {
                assignedStaffEmail: staffMember.email,
                assignedStaffName: staffMember.displayName,
            };
            assignMutation.mutate(staffInfo);
        }
    };
    
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Assign Staff to Issue ID: {issueId}</h3>
                <p className="py-4">Select a staff member from the list below:</p>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <select
                        className="select select-bordered w-full"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        disabled={assignMutation.isPending}
                    >
                        <option value="" disabled>Select Staff</option>
                        {staffList.map(staff => (
                            <option key={staff._id} value={staff.email}>
                                {staff.displayName} ({staff.email})
                            </option>
                        ))}
                    </select>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose} disabled={assignMutation.isPending}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary text-black" disabled={!selectedStaff || assignMutation.isPending}>
                            {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignStaffModal;