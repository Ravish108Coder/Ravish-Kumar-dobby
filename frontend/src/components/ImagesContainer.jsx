import React, { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react';
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    Tooltip,
    Chip,
} from "@material-tailwind/react";


function SearchButton({ setImages, filter, setFilter, fetchAllImages }) {
    const abortControllerRef = React.useRef(null);

    const onChange = ({ target }) => {
        setFilter(target.value);
        // If there's an ongoing fetch request, cancel it
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Start a new fetch request
        handleSubmitSearchImages(target.value);
    };

    const handleSubmitSearchImages = async (value) => {
        try {
            if (value === "") {
                fetchAllImages()
                return
            }
            if (value.trim() === "") {
                setImages([])
                return
            }
            // Create a new AbortController
            const abortController = new AbortController();
            abortControllerRef.current = abortController;
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/image/search/${value}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                signal: abortController.signal // Pass the signal to the fetch request
            });

            const data = await response.json();
            setImages(data?.data);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Ignore abort errors (triggered by the previous request being canceled)
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div className="relative flex w-full max-w-[24rem]">
            <Input
                type="text"
                label="Search Image With Name"
                value={filter}
                onChange={onChange}
                className="pr-4"
                containerProps={{
                    className: "min-w-0",
                }}
            />
        </div>
    );
}

const ImagesContainer = ({ uploadFormBtnRef }) => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = React.useState("");


    const fetchAllImages = async () => {
        try {
            setFilter('')
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_SERVER}/api/image/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            const data = await response.json()
            setImages(data?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const arr = [1, 2, 3, 4, 5, 6, 7, 8]
    useEffect(() => {
        fetchAllImages()
    }, [])
    return (
        <div className='p-4 flex flex-col gap-y-6'>
            <span className='inline-flex'>
                <Chip className='p-3' color='cyan' value="Your Images" />
            </span>
            {
                !loading ? (
                    <div className='flex justify-center'><SearchButton setImages={setImages}
                        filter={filter} setFilter={setFilter} fetchAllImages={fetchAllImages} /></div>
                ): (
                    <div className='h-10'></div>
                )
            }
            <div className='flex gap-8 flex-wrap'>
                {
                    loading ? (
                        <>
                            {arr.map((item, index) => (
                                <div key={index} className="grid h-36 w-36 place-items-center rounded-lg bg-gray-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-12 w-12 text-gray-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                        />
                                    </svg>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {images.map((image) => (
                                <div key={image._id}>
                                    <div className='flex flex-col gap-1 text-center'><ImageCard image={image} />
                                        <Typography className='text-pretty text-blue-gray-700'>{image.name}</Typography>
                                    </div>

                                </div>
                            ))}
                            <UploadForm uploadFormBtnRef={uploadFormBtnRef} fetchAllImages={fetchAllImages} />
                        </>
                    )
                }

                {
                    !loading &&
                    (
                        <div onClick={() => uploadFormBtnRef.current.click()} className='w-[165px] h-[165px] flex justify-center items-center bg-blue-gray-100 p-4 rounded-lg'><Upload size={"40%"} /></div>

                    )
                }
            </div>

        </div>
    )
}

export default ImagesContainer

function ImageCard({ image }) {
    return (
        <img
            className="h-40 w-full max-w-full rounded-lg object-cover object-center"
            src={image.imageUrl}
            alt={image.name}
        />
    );
}



function UploadForm({ uploadFormBtnRef, fetchAllImages }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)
    const fileInput = useRef(null);
    const [formDetails, setFormDetails] = useState({
        imageFile: null,
        imageName: '',
        imageFileName: ''
    })
    const handleOpen = () => {
        setOpen((cur) => !cur);
        setFormDetails({
            imageFile: null,
            imageName: '',
            imageFileName: ''
        })
    }
    const handleUploadPic = () => {
        fileInput.current.click();
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileName = file?.name;
        if (!(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png'))) {
            console.log('Only image files (jpg, jpeg, png) are allowed!');
            return;
        }
        setFormDetails({
            ...formDetails,
            imageFile: file,
            imageFileName: fileName
        })
    }
    const handleSubmitUploadPic = () => {
        // console.log(formDetails)
        const formData = new FormData()
        formData.append('image', formDetails.imageFile)
        formData.append('name', formDetails.imageName)

        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${import.meta.env.VITE_SERVER}/api/image/upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const data = await response.json()
                // console.log(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
                handleOpen()
            }
        }
        fetchData().then(() => fetchAllImages())
    }
    return (
        <>
            <Button className='hidden' ref={uploadFormBtnRef} onClick={handleOpen}>Sign In</Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
                dismiss={
                    {
                        outsidePress: false
                    }
                }
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Typography variant="h4" color="blue-gray">
                                Upload Pic
                            </Typography>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mr-3 h-5 w-5 cursor-pointer"
                                onClick={handleOpen}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Enter image name and file to upload image.
                        </Typography>
                        <Typography className="" variant="h6">
                            Image Name
                        </Typography>
                        <Input label="Image Name" size="lg" value={formDetails.imageName} onChange={(e) => setFormDetails({ ...formDetails, imageName: e.target.value })} />
                        <input disabled={loading} name="image" multiple={false} className="h-0" ref={fileInput} type="file" onChange={handleFileChange} />
                        <Button disabled={loading} color="blue-gray" onClick={handleUploadPic} size="lg" variant="gradient" className="flex items-center justify-center mb-3 gap-3 w-full -mt-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5 -ml-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>
                            Upload Image File
                        </Button>
                        {
                            formDetails.imageFile && (
                                <Typography className="-mt-6" color="blue-gray">
                                    {formDetails.imageFileName}
                                </Typography>
                            )
                        }
                    </CardBody>
                    <CardFooter className="pt-0 -mt-2">
                        <Button loading={loading} variant="gradient" onClick={handleSubmitUploadPic} fullWidth>
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}